const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values) {
  const errors = {};

  const name = values.name?.trim() ?? "";
  const email = values.email?.trim() ?? "";
  const project = values.project?.trim() ?? "";
  const budget = values.budget?.trim() ?? "";

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!project) {
    errors.project = "Please describe your project.";
  } else if (project.length < 10) {
    errors.project = "Please share a bit more detail (at least 10 characters).";
  } else if (project.length > 2000) {
    errors.project = "Project description must be 2000 characters or fewer.";
  }

  if (!budget) {
    errors.budget = "Please select a budget range.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
