import fetch from 'node-fetch';

async function inspect() {
  const supabaseUrl = 'https://oxvrjboqekzhnzhrajxn.supabase.co/rest/v1/';
  const supabaseAnonKey = 'sb_publishable_fz-xTvCXlIK6A_QZSKXZ3Q_M5xcyDPE';
  
  const res = await fetch(supabaseUrl, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

inspect();
