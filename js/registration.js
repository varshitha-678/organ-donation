import { supabase, isSupabaseConfigured, showSetupMessage } from "./supabase.js";
const form = document.querySelector("#registration-form");
const message = document.querySelector("#form-message");
if (form) form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  if (!isSupabaseConfigured()) return showSetupMessage(message);
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    message.textContent = "Please log in first. Redirecting to login…";
    setTimeout(() => location.href = "login.html", 900);
    return;
  }
  const display_name = document.querySelector("#display_name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const acknowledged = document.querySelector("#acknowledgement").checked;
  if (!display_name || !email || !acknowledged) {
    message.textContent = "Please complete the required fields and acknowledgement.";
    return;
  }
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true; button.textContent = "Submitting…";
  const { error } = await supabase.from("donor_registrations").insert({
    user_id: user.id,
    display_name,
    contact_email: email,
    interest_status: "submitted",
    prototype_acknowledged: true
  });
  button.disabled = false; button.textContent = "Submit expression of interest";
  if (error) {
    console.error(error);
    message.textContent = "Could not save the record. Check your database table and security policies, then try again.";
  } else {
    message.textContent = "Your expression of interest was saved. This is not official donor registration.";
    form.reset();
    setTimeout(() => location.href = "dashboard.html", 1400);
  }
});
