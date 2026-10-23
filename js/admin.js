import { supabase, isSupabaseConfigured, showSetupMessage } from "./supabase.js";
const message = document.querySelector("#admin-message");
const stats = document.querySelector("#admin-stats");
const tableWrap = document.querySelector("#admin-table-wrap");
document.querySelector("#logout-button")?.addEventListener("click", async () => {
  if (supabase) await supabase.auth.signOut();
  location.href = "index.html";
});
async function loadAdmin() {
  if (!isSupabaseConfigured()) return showSetupMessage(message);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { location.href = "login.html"; return; }
  // This check is a UI gate only. Database RLS policies must independently enforce admin access.
  if (user.app_metadata?.role !== "admin") {
    message.textContent = "Access denied. This account has not been assigned the administrator role. Ask the project owner to assign it securely.";
    return;
  }
  const { data, error } = await supabase.from("donor_registrations").select("id, display_name, contact_email, interest_status, created_at").order("created_at", { ascending: false });
  if (error) { console.error(error); message.textContent = "Could not load registrations. Confirm that administrator database policies are configured."; return; }
  message.textContent = "Authorized administrator view. Treat all records as private.";
  stats.classList.remove("hidden");
  const cards = [["Total records", data.length], ["Submitted", data.filter(x => x.interest_status === "submitted").length], ["Withdrawn", data.filter(x => x.interest_status === "withdrawn").length]];
  stats.replaceChildren(...cards.map(([label, value]) => { const div = document.createElement("div"); div.className = "stat-card"; const span = document.createElement("span"); span.textContent = label; const strong = document.createElement("strong"); strong.textContent = value; div.append(span, strong); return div; }));
  const wrap = document.createElement("div"); wrap.className = "table-scroll"; const table = document.createElement("table");
  const thead = document.createElement("thead"); const hr = document.createElement("tr");
  ["Name", "Email", "Status", "Created"].forEach(t => { const th = document.createElement("th"); th.textContent = t; hr.append(th); }); thead.append(hr);
  const tbody = document.createElement("tbody");
  data.forEach(row => { const tr = document.createElement("tr"); [row.display_name, row.contact_email, row.interest_status, new Date(row.created_at).toLocaleDateString()].forEach(value => { const td = document.createElement("td"); td.textContent = value || "—"; tr.append(td); }); tbody.append(tr); });
  table.append(thead, tbody); wrap.append(table); tableWrap.replaceChildren(wrap);
}
loadAdmin();
