import { supabase, isSupabaseConfigured, showSetupMessage } from "./supabase.js";
const message = document.querySelector("#dashboard-message");
const list = document.querySelector("#registration-list");
const welcome = document.querySelector("#welcome-text");
document.querySelector("#logout-button")?.addEventListener("click", async () => {
  if (supabase) await supabase.auth.signOut();
  location.href = "index.html";
});
async function loadDashboard() {
  if (!isSupabaseConfigured()) return showSetupMessage(message);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) { location.href = "login.html"; return; }
  welcome.textContent = "Signed in as " + user.email;
  const { data, error } = await supabase.from("donor_registrations").select("id, display_name, interest_status, created_at").order("created_at", { ascending: false });
  if (error) { console.error(error); message.textContent = "Could not load your records. Check that the database table and row-level security policies are configured."; return; }
  message.textContent = data.length ? "Your saved expressions of interest" : "No registration records yet. You can submit an expression of interest from the registration page.";
  list.replaceChildren();
  data.forEach((record) => {
    const card = document.createElement("article"); card.className = "registration-card";
    const left = document.createElement("div");
    const heading = document.createElement("h3"); heading.textContent = record.display_name || "Expression of interest";
    const date = document.createElement("p"); date.textContent = "Submitted: " + new Date(record.created_at).toLocaleString();
    const note = document.createElement("p"); note.textContent = "Educational prototype record only.";
    left.append(heading, date, note);
    const status = document.createElement("span"); status.className = "status-pill"; status.textContent = record.interest_status;
    card.append(left, status); list.append(card);
  });
}
loadDashboard();
