const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = ".....";
const inputInitHeight = chatInput.scrollHeight;
const createChatLi = (message,className) =>{
    // tạo phần tử trò chuyện <li > với tin nhắn và tên lớp được chuyển

    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;

   chatLi.innerHTML = chatContent;
   return chatLi;

}

const generateResponse = (iscomingChatLi) => {

    // Thêm biểu tượng bot vào dòng đầu tiên của lớp "incoming"
    const botIcon = document.createElement("span");
    botIcon.innerHTML = "<i class='bx bx-bot'></i>"; 
    iscomingChatLi.appendChild(botIcon);

    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = iscomingChatLi.querySelector("p");
    iscomingChatLi.appendChild(messageElement);

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    // Gửi POST request tới API và nhận phản hồi
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent = "Oops! something went wrong. Please try again."

        }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat =() => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;


// nối tin nhắn của người dùng vào hộp trò chuyện
    chatbox.appendChild(createChatLi(userMessage,"outgoing")) ;
    chatbox.scrollTo(0,chatbox.scrollHeight);
    setTimeout (() =>{
        // hiển thị chữ "thinking..." trong thời gian chờ phản hồi
        const iscomingChatLi = createChatLi("Thinking...","incoming")
    chatbox.appendChild(iscomingChatLi) ;
    chatbox.scrollTo(0,chatbox.scrollHeight);
    generateResponse(iscomingChatLi);
    },600);
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;

});

chatInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat)
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));

