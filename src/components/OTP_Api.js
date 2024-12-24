export async function otp(email, number, name){
    fetch('https://mailbackend.mdabir.cloud/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          cc: [""],
          bcc: [""],
          subject: "Email Verification",
          text: `Dear ${name}, your OTP is ${number}`,
          body: `Dear ${name}, your OTP is ${number}`,
          apitoken: "zgy8sVX8xnK9OSUnFaTcunjgTssTsb9GATTL8vM4k5hft0fPil9mdoYSoYW1FeAj9iZSgtsj3oH23m3kXZHssCIK8DjO2bmPouMd3xzPYfGGKh1UAc4KWhtV10V9KaPSFcpCL2mkZnupInD1XDil6PP41a0HwZPiOtGRxh7WvwIXJm3TVHBpEVrg35jxmSN4u1HbmSKZPG9zqIuBTILLcBTdUxp0uvbFRh8bFdN6f6s80kWGOyO7oZQ6pe",
        }),
      })
        .then(response => response.json())
        .then(data => console.log(data.status))
        .catch(error => console.error('Error:', error));
}