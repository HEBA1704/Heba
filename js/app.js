const SUPABASE_URL = "https://niuuzufbvvvtoweykdyi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdXV6dWZidnZ2dG93ZXlrZHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NTI2MjQsImV4cCI6MjEwNjQyODYyNH0.hPqMKUxfnNcLDC9xhuAvl1ARr8C21WvAyxThD-7hPOw";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function loadProducts() {  
  const { data: products, error } = await supabase    
    .from("product")    
    .select("*, category(category_name)")    
    .order("name");   

  if (error) {    
    document.getElementById("product-list").innerHTML = `<p>Could not load products: ${error.message}</p>`;    
    return;  }  
  
  renderProducts(products);
} 

loadProducts();
