
import {
  supabase,
  isSupabaseConfigured,
  showSetupMessage
} from "./supabase.js";

const form = document.querySelector("#auth-form");
const message = document.querySelector("#auth-message");
const loginTab = document.querySelector("#login-tab");
const signupTab = document.querySelector("#signup-tab");
const nameField = document.querySelector("#name-field");
const submit = document.querySelector("#auth-submit");

let mode = "login";

function setMode(next) {
  mode = next;

  loginTab?.classList.toggle("active", mode === "login");
  signupTab?.classList.toggle("active", mode === "signup");
  nameField?.classList.toggle("hidden", mode !== "signup");

  const fullName = document.querySelector("#full-name");
  if (fullName) fullName.required = mode === "signup";

  if (submit) {
    submit.textContent = mode === "login"
      ? "Log in"
      : "Create account";
  }

  if (message) message.textContent = "";
}

loginTab?.addEventListener("click", () => setMode("login"));
signupTab?.addEventListener("click", () => setMode("signup"));

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!message || !submit) return;

  message.textContent = "";

  if (!isSupabaseConfigured() || !supabase) {
    showSetupMessage(message);
    return;
  }

  const email = document.querySelector("#auth-email")?.value.trim();
  const password = document.querySelector("#password")?.value;
  const fullName = document.querySelector("#full-name")?.value.trim();

  if (!email || !password) {
    message.textContent = "Please enter your email and password.";
    return;
  }

  if (mode === "signup" && !fullName) {
    message.textContent = "Please enter your full name.";
    return;
  }

  submit.disabled = true;

  try {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: fullName }
        }
      });

      if (error) throw error;

      if (data.session) {
        message.textContent = "Account created! Opening dashboard...";
        setTimeout(() => {
          location.href = "dashboard.html";
        }, 1000);
      } else {
        message.textContent =
          "Account request submitted. Check your email for a confirmation link, then log in.";
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      message.textContent = "Login successful! Opening dashboard...";

      setTimeout(() => {
        location.href = "dashboard.html";
      }, 1000);
    }
  } catch (error) {
    console.error("LifeLink authentication error:", error);
    message.textContent =
      error.message || "Something went wrong. Please try again.";
  } finally {
    submit.disabled = false;
  }
});

setMode("login");

