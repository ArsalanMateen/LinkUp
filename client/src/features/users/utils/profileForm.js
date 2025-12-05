export function profileFormData(values, includeCredentials) {
  const data = new FormData();
  data.append("name", values.name.trim());
  data.append("about", values.about.trim());

  if (includeCredentials) {
    data.append("email", values.email.trim());
    if (values.password) data.append("password", values.password);
  }

  return data;
}
