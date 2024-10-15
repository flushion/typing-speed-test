## 📦 Application - Typing Speed Test

### 🚀 Overview
This code represents the `TypingSpeed` class, which implements a typing speed test. It loads text for typing, tracks user input, and displays the results on the screen.

1. The class imports necessary dependencies and defines the `IData` interface for the data structure. 
2. The `TypingSpeed` class contains private properties for storing test data, DOM elements, and the timer. 
3. The class constructor initializes by calling the `initialize` method, which creates the DOM structure. 
4. The `setupEventListeners` method sets up event listeners for the "Try Again" button and text input. 
5. The `init` method initializes the test by loading the text for typing and setting the initial values. 
6. The `handleInput` method processes user input, tracks accuracy, and updates WPM, CPM, and mistake counts. 
7. The `handleReset` method resets the test to its initial state. 
8. The `initialTimer` method handles the countdown and updates WPM during the test.

At the end of the code, an instance of the `TypingSpeed` class is created, starting the test when the page loads.

---

#### 🌄 Preview:

![Preview](https://i.ibb.co/cCnzgkh/Capture-d-cran-2024-10-15-16-33-36.png)

-----

#### 🙌 Author: [@flushion](https://github.com/flushion)