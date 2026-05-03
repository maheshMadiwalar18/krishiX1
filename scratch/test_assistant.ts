async function testAssistant() {
  const response = await fetch('http://localhost:5001/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'ನಮಸ್ಕಾರ', language: 'Kannada' })
  });
  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Data:', data);
}
testAssistant();
