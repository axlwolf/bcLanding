// scripts/migrateLandingContent.js
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin tasks

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Supabase URL or Service Key is not defined in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const landingContentFilePath = path.join(process.cwd(), 'data', 'landingContent.json');

const DEFAULT_LANDING_PAGE_SLUG = 'main-landing';
const DEFAULT_LANDING_PAGE_NAME = 'Default Landing Page';

async function migrate() {
  console.log('Starting landing content migration to Supabase...');

  try {
    // 1. Read and parse landingContent.json
    if (!fs.existsSync(landingContentFilePath)) {
      console.error(`Error: ${landingContentFilePath} not found.`);
      process.exit(1);
    }
    const fileContent = fs.readFileSync(landingContentFilePath, 'utf-8');
    const landingContent = JSON.parse(fileContent);
    console.log('Successfully read and parsed landingContent.json.');

    const pageType = landingContent.pageType || 'generic'; // Default if pageType is missing

    // 2. Clean up existing data for this slug (optional, for idempotency)
    // First, delete from page_content, then from landing_pages due to foreign key constraints
    console.log(`Checking for existing page with slug: ${DEFAULT_LANDING_PAGE_SLUG}`);
    const { data: existingPage, error: fetchError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', DEFAULT_LANDING_PAGE_SLUG)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 'Fetched row returned no data' (expected if page doesn't exist)
        console.error('Error fetching existing page:', fetchError);
        // Decide if you want to exit or try to proceed. For safety, exiting might be better.
        // process.exit(1);
    }


    if (existingPage) {
      console.log(`Found existing page with ID: ${existingPage.id}. Deleting its content and the page itself...`);
      const { error: deleteContentError } = await supabase
        .from('page_content')
        .delete()
        .eq('page_id', existingPage.id);

      if (deleteContentError) {
        console.error('Error deleting existing page_content:', deleteContentError);
        process.exit(1);
      }
      console.log('Successfully deleted existing page_content.');

      const { error: deletePageError } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', existingPage.id);

      if (deletePageError) {
        console.error('Error deleting existing landing_page:', deletePageError);
        process.exit(1);
      }
      console.log('Successfully deleted existing landing_page.');
    } else {
      console.log('No existing page found with that slug. Proceeding with new insertion.');
    }


    // 3. Insert into landing_pages
    console.log(`Inserting into landing_pages: slug='${DEFAULT_LANDING_PAGE_SLUG}', page_type='${pageType}', name='${DEFAULT_LANDING_PAGE_NAME}'`);
    const { data: newPage, error: insertPageError } = await supabase
      .from('landing_pages')
      .insert({
        slug: DEFAULT_LANDING_PAGE_SLUG,
        page_type: pageType,
        name: DEFAULT_LANDING_PAGE_NAME,
        is_active: true,
        // template_id: 'Main' // Or derive/leave null as discussed
      })
      .select()
      .single();

    if (insertPageError) {
      console.error('Error inserting into landing_pages:', insertPageError);
      process.exit(1);
    }
    if (!newPage) {
      console.error('Failed to insert new page or retrieve its ID.');
      process.exit(1);
    }
    console.log(`Successfully inserted into landing_pages. New page ID: ${newPage.id}`);

    // 4. Insert into page_content
    const sectionsToInsert = [];
    let displayOrder = 0;
    for (const sectionSlug in landingContent) {
      if (sectionSlug === 'pageType') {
        continue; // Skip the pageType property itself
      }
      if (Object.prototype.hasOwnProperty.call(landingContent, sectionSlug)) {
        sectionsToInsert.push({
          page_id: newPage.id,
          section_slug: sectionSlug,
          content: landingContent[sectionSlug], // Store the whole section object/array
          display_order: displayOrder++,
          is_active: true,
        });
      }
    }

    if (sectionsToInsert.length > 0) {
      console.log(`Preparing to insert ${sectionsToInsert.length} sections into page_content...`);
      const { error: insertContentError } = await supabase
        .from('page_content')
        .insert(sectionsToInsert);

      if (insertContentError) {
        console.error('Error inserting into page_content:', insertContentError);
        process.exit(1);
      }
      console.log(`Successfully inserted ${sectionsToInsert.length} sections into page_content.`);
    } else {
      console.log('No sections found to insert into page_content.');
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('An unexpected error occurred during migration:', error);
    process.exit(1);
  }
}

migrate();
