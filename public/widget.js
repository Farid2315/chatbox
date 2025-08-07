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
    width: 350px;
    height: 500px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    padding: 15px;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <span>💬 Chat Support</span>
    <button id="minimize-widget" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">−</button>
  `;
  
  // Create iframe for chat
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/widget/chatbox?room=${roomId}`;
  iframe.style.cssText = `
    flex: 1;
    border: none;
    border-radius: 0 0 10px 10px;
  `;
  
  // Create minimize button functionality
  const minimizeBtn = header.querySelector('#minimize-widget');
  let isMinimized = false;
  
  minimizeBtn.addEventListener('click', () => {
    if (isMinimized) {
      widgetContainer.style.height = '500px';
      minimizeBtn.textContent = '−';
      isMinimized = false;
    } else {
      widgetContainer.style.height = '60px';
      minimizeBtn.textContent = '+';
      isMinimized = true;
    }
  });
  
  // Assemble widget
  widgetContainer.appendChild(header);
  widgetContainer.appendChild(iframe);
  
  // Add to page
  document.body.appendChild(widgetContainer);
  
  // Add some basic styles to prevent conflicts
  const style = document.createElement('style');
  style.textContent = `
    #chatbox-widget * {
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
})();
