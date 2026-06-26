// frontend/src/api/getErrorMessage.js

export function getErrorMessage(error) {
  const data = error?.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join(' ');
  }

  if (data?.message) {
    return data.message;
  }

  return 'Something went wrong. Please try again.';
}
