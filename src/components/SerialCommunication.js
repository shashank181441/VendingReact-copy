// Global variable to hold the serial port instance
let existingPort = null;

// Function to handle serial communication
export const handleSerialCommunication = async (data) => {
  // Function to connect to the serial port
  const connectSerial = async () => {
    try {
      // Check if there is an existing port
      if (existingPort) {
        console.log('Using existing serial port:', existingPort);
        return existingPort; // Reuse the existing port
      }

      // If no existing port, request the user to select one
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 }); // Open the port with a specific baud rate
      existingPort = selectedPort; // Store the port for future use
      console.log('New serial port connected:', selectedPort);

      // Start reading data as soon as the port is connected
      readSerialData(selectedPort);
      return selectedPort;
    } catch (error) {
      console.error('Error connecting to the serial port:', error);
      return null;
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
  const sendData = async (port, data) => {
    if (port) {
      try {
        const writer = port.writable.getWriter();
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

  // Main execution: check for existing port or connect new
  const port = await connectSerial();
  if (port) {
    await sendData(port, data);
  }

  // Cleanup function to close the port when done
  return () => {
    if (existingPort) {
      existingPort.close().then(() => {
        console.log('Serial port closed');
        existingPort = null; // Clear the global port when closed
      });
    }
  };
};

// Usage example
handleSerialCommunication('Your Data Here');
