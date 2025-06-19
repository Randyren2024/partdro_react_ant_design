import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dedqucsoihojgahamwrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZHF1Y3NvaWhvamdhaGFtd3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjQyMTAsImV4cCI6MjA2NTMwMDIxMH0.rSGIzFUnceLAxHMcZJkir43czzKuBzeSc9Wtr6Ui1ds';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Connection successful! Found', data?.length || 0, 'products');
      if (data && data.length > 0) {
        console.log('Sample product:', data[0]);
      }
    }
    
    // Test categories
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    
    if (catError) {
      console.error('Categories error:', catError);
    } else {
      console.log('Categories found:', categories?.length || 0);
      console.log('All categories:', categories);
    }
    
    // Test products by category using 'drones' as category name
    console.log('\nTesting products by category name "drones"...');
    const { data: droneProducts, error: droneError } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'drones');
    
    if (droneError) {
      console.error('Drone products error:', droneError);
    } else {
      console.log('Drone products found:', droneProducts?.length || 0);
    }
    
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

testConnection();