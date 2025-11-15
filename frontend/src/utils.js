export const showMessage = (text, type, setMessage) => {
  if (setMessage) {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  } else {
    alert(text);
  }
};