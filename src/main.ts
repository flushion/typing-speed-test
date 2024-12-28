import './style.scss';
import mock from '../src/mock/index';
import axios from 'axios';
import { toast } from './utils/toast.ts';

/**
 * @interface IData
 * @description Interface representing the structure of data to display information on the page.
 * @property {string} label - The name of the metric.
 * @property {string | number} value - The value of the metric.
 * @property {string} data - The type of data.
 */
interface IData {
  label: string,
  value: string | number,
  data: string
}

const data: IData[] = [
  { label: 'Time Left', value: '60s', data: 'time' },
  { label: 'Mistakes', value: 0, data: 'mistake' },
  { label: 'WPM', value: 0, data: 'wpm' },
  { label: 'CPM', value: 0, data: 'cpm' },
];

/**
 * @class TypingSpeed
 * @description The TypingSpeed class represents a typing speed test and manages its functionality.
 */
class TypingSpeed {
  private mock: string[] = mock;
  private timer: number | null = null;
  private maxTime: number = 60;
  private timeLeft: number = 0;
  private charIndex: number = 0;
  private mistakes: number = 0;
  private isTyping: number = 0;

  private typing: HTMLParagraphElement;
  private inputTyping: HTMLInputElement;
  private btnReset: HTMLButtonElement;
  private optionTime: HTMLSpanElement;
  private optionMistake: HTMLSpanElement;
  private optionWpm: HTMLSpanElement;
  private optionCpm: HTMLSpanElement;

  /**
   * @constructor
   * @description Constructor of the TypingSpeed class. Calls the initialize() method to set up the components.
   */
  constructor() {
    this.initialize();
  }

  /**
   * @private
   * @method initialize
   * @description Initializes components and sets up event listeners.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * @private
   * @method createDOM
   * @description Creates the DOM structure for displaying the test on the page.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Typing Speed Test</h1>
        <input class='visually-hidden' type='text' data-input>
        <p class='p-1 rounded border tracking-widest\t' data-typing></p>
        <ul class='grid gap-2 grid-cols-4'>
          ${data.map(({ label, value, data }) => `
            <li class='grid gap-1.5'>
              <p class='font-medium'>${label}:</p>
              <span class='p-1 bg-gray-200 rounded' data-${data}>${value}</span>
            </li>
          `).join('')}
        </ul>
        <button class='px-3 py-2 border hover:bg-slate-50' data-reset>Try Again</button>
      </div>
    `;

    this.typing = root.querySelector('[data-typing]')!;
    this.inputTyping = root.querySelector('[data-input]')!;
    this.btnReset = root.querySelector('[data-reset]')!;
    this.optionTime = root.querySelector('[data-time]')!;
    this.optionMistake = root.querySelector('[data-mistake]')!;
    this.optionWpm = root.querySelector('[data-wpm]')!;
    this.optionCpm = root.querySelector('[data-cpm]')!;
  }

  /**
   * @private
   * @method setupEventListeners
   * @description Sets up event listeners.
   */
  private setupEventListeners(): void {
    this.init();
    this.btnReset.addEventListener('click', this.handleReset.bind(this));
    this.inputTyping.addEventListener('input', this.handleInput.bind(this));
  }

  /**
   * @private
   * @method init
   * @description Initializes the test by loading text for typing and setting initial values.
   */
  private async init(): Promise<void> {
    try {
      this.typing.innerHTML = '<h4>Loading...</h4>';
      const {
        data: {
          0: text,
        },
      } = await axios.get('https://baconipsum.com/api/?type=all-meat&sentences=4&format=json');
      this.typing.innerHTML = '';
      const paragraph = text || this.mock[Math.floor(Math.random() * this.mock.length)];
      paragraph.split('').forEach((char, idx) => this.typing.innerHTML += `<span class='${idx === 0 ? 'active border-b-2 border-orange-500 text-orange-500' : ''}'>${char}</span>`);
      this.typing.addEventListener('click', () => this.inputTyping.focus());
      document.addEventListener('keydown', () => this.inputTyping.focus());
    } catch (e) {
      console.log(e);
      toast('Something went wrong, open dev console', 'error');
    }
  }
  

  /**
   * @private
   * @method handleInput
   * @param {string} value - The text entered by the user.
   * @description Handles user input and tracks metrics.
   */
  private handleInput({ target: { value } }: { target: { value: string } }): void {
    const characters = this.typing.querySelectorAll('span');
    const typedChar = value.split('')[this.charIndex];

    if (this.charIndex < characters.length - 1 && this.timeLeft > 0) {
      if (!this.isTyping) {
        this.timer = setInterval(this.initialTimer.bind(this), 1000);
        this.isTyping = true;
      }
      if (typedChar === null) {
        if (this.charIndex > 0) {
          this.charIndex--;
          if (characters[this.charIndex].classList.contains('incorrect')) {
            this.mistakes--;
          }
          characters[this.charIndex].classList.remove('correct', 'incorrect');
        }
      } else {
        if (characters[this.charIndex].innerText === typedChar) {
          characters[this.charIndex].classList.add('correct', 'text-green-500', 'border-green-500');
        } else {
          this.mistakes++;
          characters[this.charIndex].classList.add('incorrect', 'text-red-500', 'border-red-500');
        }
        this.charIndex++;
      }
      characters.forEach(span => span.classList.remove('active'));
      characters[this.charIndex].classList.add('active', 'border-b');
      let wpm = Math.round(((this.charIndex - this.mistakes) / 5) / (this.maxTime - this.timeLeft) * 60);
      this.optionWpm.innerText = String(wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm);
      this.optionMistake.innerText = String(this.mistakes);
      this.optionCpm.innerText = String(this.charIndex - this.mistakes);

    } else {
      clearInterval(this.timer);
      this.inputTyping.value = '';
    }
  }

  /**
   * @private
   * @method handleReset
   * @description Resets the test to its initial values.
   */
  private handleReset(): void {
    this.init();
    clearInterval(this.timer);
    this.timeLeft = this.maxTime;
    this.charIndex = this.mistakes = this.isTyping = 0;
    this.inputTyping.value = '';
    this.optionTime.innerText = String(this.timeLeft);
    this.optionWpm.innerText = String(this.optionMistake.innerText = String(this.optionCpm.innerText = String(0)));
  }

  /**
   * @private
   * @method initialTimer
   * @description Countdown timer for the test and updates WPM metrics.
   */
  private initialTimer(): void {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.optionTime.innerText = String(this.timeLeft);
      this.optionWpm.innerText = String(Math.round(((this.charIndex - this.mistakes) / 5) / (this.maxTime - this.timeLeft) * 60));
    } else {
      clearInterval(this.timer);
    }
  }
}

new TypingSpeed();