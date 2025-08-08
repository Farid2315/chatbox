(function() {
  // Get script tag to extract data attributes
  const script = document.currentScript;
  const baseUrl = script.getAttribute('data-base') || window.location.origin;
  const roomId = script.getAttribute('data-room') || 'default-room';
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chatbox-widget';
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  
  // Create the chat button (initial state)
  const chatButton = document.createElement('button');
  chatButton.id = 'chat-button';
  chatButton.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  `;
  chatButton.innerHTML = '💬';
  
  // Add hover effect
  chatButton.addEventListener('mouseenter', () => {
    chatButton.style.transform = 'scale(1.1)';
    chatButton.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.4)';
  });
  
  chatButton.addEventListener('mouseleave', () => {
    chatButton.style.transform = 'scale(1)';
    chatButton.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
  });
  
  // Create the chat window (hidden initially)
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-window';
  chatWindow.style.cssText = `
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 15px 15px 0 0;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  `;
  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">💬</span>
      <span>Chat Support</span>
    </div>
    <button id="close-chat" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
  `;
  
  // Create iframe for chat
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/widget/chatbox?room=${roomId}`;
  iframe.style.cssText = `
    flex: 1;
    border: none;
    border-radius: 0 0 15px 15px;
  `;
  
  // Add notification badge
  const notificationBadge = document.createElement('div');
  notificationBadge.id = 'notification-badge';
  notificationBadge.style.cssText = `
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background: #ef4444;
    border-radius: 50%;
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  notificationBadge.textContent = '1';
  
  // Add notification badge to chat button
  chatButton.appendChild(notificationBadge);
  
  // Assemble chat window
  chatWindow.appendChild(header);
  chatWindow.appendChild(iframe);
  
  // Add both elements to container
  widgetContainer.appendChild(chatButton);
  widgetContainer.appendChild(chatWindow);
  
  // Chat state management
  let isChatOpen = false;
  let hasUnreadMessages = false;
  
  // Toggle chat function
  function toggleChat() {
    if (isChatOpen) {
      // Close chat
      chatWindow.style.display = 'none';
      chatButton.style.display = 'flex';
      isChatOpen = false;
      hasUnreadMessages = false;
      notificationBadge.style.opacity = '0';
    } else {
      // Open chat
      chatButton.style.display = 'none';
      chatWindow.style.display = 'flex';
      isChatOpen = true;
      hasUnreadMessages = false;
      notificationBadge.style.opacity = '0';
    }
  }
  
  // Event listeners
  chatButton.addEventListener('click', toggleChat);
  
  const closeBtn = header.querySelector('#close-chat');
  closeBtn.addEventListener('click', toggleChat);
  
  // Listen for messages from iframe to show notification
  window.addEventListener('message', (event) => {
    if (event.origin !== baseUrl) return;
    
    if (event.data.type === 'new-message' && !isChatOpen) {
      hasUnreadMessages = true;
      notificationBadge.style.opacity = '1';
    }
  });
  
  // Add to page
  document.body.appendChild(widgetContainer);
  
  // Add some basic styles to prevent conflicts
  const style = document.createElement('style');
  style.textContent = `
    #chatbox-widget * {
      box-sizing: border-box;
    }
    
    #chat-button:hover {
      transform: scale(1.1);
    }
    
    #close-chat:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
})();
