// Global variable to hold the serial port instance
let existingPort = null;
// let baudRate=115200
let baudRate=9600

// Function to initialize the serial connection
export const initializeSerial = async () => {
  try {
    // Check if there is an existing port
    if (existingPort) {
      console.log('Using existing serial port:', existingPort);
      return existingPort; // Reuse the existing port
    }

    // If no existing port, request the user to select one
    const ports = await navigator.serial.getPorts();
    console.log("ports:", ports)
    const selectedPort = await navigator.serial.requestPort();
    console.log(JSON.stringify(selectedPort))
    console.log(selectedPort)
    await selectedPort.open({ baudRate: baudRate }); // Open the port with a specific baud rate
    existingPort = selectedPort; // Store the port for future use
    console.log('New serial port connected:', selectedPort);

    // Start reading data as soon as the port is connected
    readSerialData(selectedPort);
  } catch (error) {
    console.error('Error connecting to the serial port:', error);
  }
};

// Function to read serial data continuously
const readSerialData = async (selectedPort) => {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = selectedPort.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      console.log(value)
      if (done) {
        break; // If the stream is done, stop reading
      }
      console.log('Received data:', value);
    }
  } catch (error) {
    console.error('Error reading data from the serial port:', error);
  } finally {
    reader.releaseLock(); // Release the reader lock when done
  }
};

// Function to send data to the serial port
export const sendSerialData = async (data) => {
  if (existingPort) {
    try {
      const writer = existingPort.writable.getWriter();
      await writer.write(new TextEncoder().encode(data + '\n')); // Send data with newline
      writer.releaseLock(); // Release the writer lock after writing
      console.log('Data sent:', data);
    } catch (error) {
      console.error('Error sending data to the serial port:', error);
    }
  } else {
    console.error('Serial port is not connected.');
  }
};

// Cleanup function to close the serial port when done
export const closeSerialPort = async () => {
  if (existingPort) {
    await existingPort.close();
    console.log('Serial port closed');
    existingPort = null; // Clear the global port when closed
  }
};
