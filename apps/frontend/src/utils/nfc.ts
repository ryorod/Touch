export const writeDataToNFC = async (data: {
  url: string;
  secretToken: string;
}) => {
  if ("NDEFReader" in window) {
    try {
      const NDEFReader = window.NDEFReader as any;
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: data.url,
          },
          {
            recordType: "text",
            data: data.secretToken,
          },
        ],
      });
      alert("Finished writing to your NFC card");
    } catch (error) {
      console.error("NFC Writing Error:", error);
      alert("Failed writing to your NFC card");
    }
  } else {
    alert("This device does not support NFC");
  }
};

export const readTextFromNFC = async () => {
  if ("NDEFReader" in window) {
    try {
      const NDEFReader = window.NDEFReader as any;
      const ndef = new NDEFReader();
      await ndef.scan();

      const text = await new Promise<string>((resolve, reject) => {
        ndef.onreading = (event: any) => {
          let foundText = false;
          for (const record of event.message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const decodedText = textDecoder.decode(record.data);
              resolve(decodedText);
              foundText = true;
              break;
            }
          }
          if (!foundText) {
            reject("No text record found");
          }
        };

        ndef.onerror = (error: any) => {
          reject(error);
        };
      });

      return text;
    } catch (error) {
      console.error("NFC Reading Error:", error);
      alert("Failed reading from the NFC card");
      return null;
    }
  } else {
    alert("This device does not support NFC");
    return undefined;
  }
};
