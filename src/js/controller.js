window.addEventListener('load', async () => {
  console.log('Page loaded');

  const sendQuestionButton = document.querySelector('[wized="send_question"]');
  sendQuestionButton.addEventListener('click', async () => {
    console.log('Send question button clicked');

    const question = await Wized.data.get('v.sentquestion');
    console.log('Question:', question);

    let chatArray = await Wized.data.get('v.chat');
    console.log('Chat array before processing:', chatArray);

    if (
      Array.isArray(chatArray) &&
      (chatArray.length === 0 || ('elapse' in chatArray[chatArray.length - 1] && 'user' in chatArray[chatArray.length - 1]))
    ) {
      const userInput = {};
      userInput.user = question;
      chatArray.push(userInput);
      console.log('User input:', userInput);

      await Wized.data.setVariable('chat', []);
      await Wized.data.setVariable('chat', chatArray);

      console.log('Chat array after processing:', chatArray);
    } else {
      console.error('userinput error');
    }
  });

  Wized.request.await('Chat', async response => {
    console.log('Chat response:', response);

    const answer = response.data.answer;
    console.log('Answer:', answer);

    let chatArray = await Wized.data.get('v.chat');
    console.log('Chat array before processing:', chatArray);
    console.log(`Length formula: ${chatArray[chatArray.length - 1].length}`);
    console.log(`Other: ${chatArray[chatArray.length - 1]}`);

    if ('user' in chatArray[chatArray.length - 1] && !('elapse' in chatArray[chatArray.length - 1])) {
      chatArray[chatArray.length - 1].elapse = answer;
      console.log('Elapse added:', answer);

      await Wized.data.setVariable('chat', []);
      await Wized.data.setVariable('chat', chatArray);

      console.log('Chat array after processing:', chatArray);
    } else {
      console.error('system input error');
    }
  });
});
