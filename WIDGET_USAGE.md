# ChatBox Widget Usage

## Overview
The ChatBox widget is a modern, interactive chat interface that starts as a floating button and expands into a full chat window when clicked. It's designed to be easily integrated into any website.

## Features
- 🎯 **Smart Button**: Starts as a floating chat button
- 🔔 **Notifications**: Shows notification badges for new messages
- 🎨 **Modern Design**: Clean, responsive interface with smooth animations
- ⚡ **Real-time**: Powered by Socket.IO for instant messaging
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Installation

### 1. Add the Widget Script
Include the widget script in your HTML page:

```html
<script src="http://localhost:3000/widget.js" 
        data-base="http://localhost:3000" 
        data-room="your-room-id"></script>
```

### 2. Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-base` | Base URL of your ChatBox server | `window.location.origin` |
| `data-room` | Room/conversation ID | `'default-room'` |

### 3. Example Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- ChatBox Widget -->
    <script src="http://localhost:3000/widget.js" 
            data-base="http://localhost:3000" 
            data-room="customer-support"></script>
</body>
</html>
```

## Widget Behavior

### Initial State
- Shows as a floating blue button with chat icon (💬)
- Positioned in the bottom-right corner
- Hover effects with scale animation

### When Clicked
- Button disappears
- Chat window expands with smooth animation
- Full chat interface becomes available

### When Closed
- Chat window disappears
- Button reappears
- Notification badge shows if new messages arrive

### Notification System
- Red notification badge appears when new admin messages arrive
- Badge disappears when chat is opened
- Badge shows message count

## Styling Customization

The widget uses CSS-in-JS for styling. To customize the appearance, you can modify the `widget.js` file:

### Button Styling
```javascript
chatButton.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    // ... other styles
`;
```

### Chat Window Styling
```javascript
chatWindow.style.cssText = `
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 15px;
    // ... other styles
`;
```

## Testing

### 1. Start the Socket Server
```bash
npm run socket
```

### 2. Start the Next.js App
```bash
npm run dev
```

### 3. Test the Widget
- Open `http://localhost:3000/test-widget.html` in your browser
- Look for the chat button in the bottom-right corner
- Click to open the chat interface
- Send messages to test the functionality

## Integration with Admin Dashboard

The widget connects to the same Socket.IO server as the admin dashboard:

1. **Admin Dashboard**: `http://localhost:3000/dashboard`
2. **Widget**: Embedded in client websites
3. **Socket Server**: `http://localhost:3001` (handles all communication)

## Message Flow

1. **Customer sends message** → Widget → Socket Server → Admin Dashboard
2. **Admin sends message** → Admin Dashboard → Socket Server → Widget
3. **Notification** → Widget shows badge when chat is closed

## Troubleshooting

### Widget Not Appearing
- Check if the script URL is correct
- Ensure the Socket.IO server is running
- Check browser console for errors

### Messages Not Sending
- Verify Socket.IO server is running on port 3001
- Check network connectivity
- Ensure room ID is consistent

### Styling Issues
- Widget uses high z-index (10000) to appear above other content
- Check for CSS conflicts in your website
- Widget styles are self-contained to prevent conflicts

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## Performance

- Lightweight: ~15KB gzipped
- No external dependencies (except Socket.IO)
- Efficient memory usage
- Smooth animations with CSS transitions
