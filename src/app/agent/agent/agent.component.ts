import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Suggestion } from '../../core/interfaces/suggestion.interface';
import { MessageSuggestionService } from '../../core/services/message-suggestion.service';
import { AgentService } from '../agent.service';
import { Message } from '../../core/interfaces/message.interface';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  animations: [
    trigger('toggleChat', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(100%)',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('hidden => visible', [animate('0.5s ease-in-out')]),
      transition('visible => hidden', [animate('0.5s ease-in-out')]),
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
  ],
})
export class AgentComponent implements OnInit {
  public file: File | null = null;
  public inputText: string = '';
  public messages: Message[] = [];
  public isGenerating: boolean = false;
  public chatVisible: boolean = false;
  public isChatHeaderVisible: boolean = false;
  public isChatPromptVisible: boolean = true;
  public translations: any;
  public prompt: string = '';
  public isProfileInfoHeaderVisible: boolean = true;
  public suggestions: Suggestion[] = [];
  public currentSuggestionIndex: number = 0;
  public archivo: File | null = null;
  public isVoiceCallActive: boolean = false;

  private generationSubscription!: Subscription;

  @ViewChild('chatArea') chatArea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('nameLabels') nameLabels!: ElementRef;

  constructor(
    private agentService: AgentService,
    private translationService: TranslationService,
    private messageSuggestionService: MessageSuggestionService
  ) {}

  ngOnInit() {
    this.translations = this.translationService.getTranslations();
    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
      this.updateSuggestions();
    });

    this.updateSuggestions();

    this.messageSuggestionService.getAllSuggestions().subscribe({
      next: (suggestions: Suggestion[]) => {
        if (suggestions && suggestions.length > 0) {
          this.suggestions = suggestions;
        }
      },
      error: (err) => {
        console.error('Error getting suggestions:', err);
      },
    });
  }

  async onSubmit() {
    if (!this.inputText.trim() && !this.file) return;

    const userMessage: Message = {
      from: 'user',
      content: this.inputText.trim(),
      fileName: this.file ? this.file.name : undefined,
    };

    this.messages.push(userMessage);
    const currentPrompt = this.inputText.trim();
    this.inputText = '';
    this.smoothScrollToBottom();

    const tempFile = this.file;
    this.file = null;

    this.isGenerating = true;
    this.isChatPromptVisible = false;

    if (tempFile) {
      try {
        await this.uploadPDF(tempFile, currentPrompt);
      } catch (error) {
        console.error('Error uploading the file:', error);
      } finally {
        this.resetFileInput();
      }
    } else {
      await this.sendMessage(currentPrompt);
    }
  }

  async uploadPDF(file: File, prompt: string): Promise<void> {
    if (!file) return;

    const loadingMessage: Message = {
      from: 'assistant',
      content: '',
      isLoading: true,
    };
    this.messages.push(loadingMessage);

    try {
      await this.agentService.uploadPDF(file).toPromise();
      await this.askQuestion(prompt);
    } catch (error) {
      console.error('Error processing the request', error);
      loadingMessage.isLoading = false;
      loadingMessage.content =
        'An error occurred while processing your request. Please try again.';
    }
  }

  askQuestion(question: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.agentService.askQuestion(question).subscribe({
        next: (data) => {
          const lastMessageIndex = this.messages.length - 1;
          this.messages[lastMessageIndex].content =
            data?.choices?.[0]?.message?.content ||
            'Could not interpret the response.';
          this.messages[lastMessageIndex].isLoading = false;
          this.isGenerating = false;
          resolve();
        },
        error: (error) => {
          console.error('Error asking the question', error);
          const lastMessageIndex = this.messages.length - 1;
          this.messages[lastMessageIndex].content =
            'An error occurred while processing your request.';
          this.messages[lastMessageIndex].isLoading = false;
          this.isGenerating = false;
          reject(error);
        },
      });
    });
  }

  updateSuggestions() {
    this.suggestions = [
      {
        id: 1,
        message:
          this.translations?.reduceConsumption ||
          'How can consumption be reduced efficiently?',
      },
      {
        id: 2,
        message:
          this.translations?.optimizeResources ||
          'Suggestions to optimize resource usage at home',
      },
      {
        id: 3,
        message:
          this.translations?.environmentalImpact ||
          'What is the environmental impact of resource consumption?',
      },
    ];
  }

  smoothScrollToBottom() {
    const targetPosition = this.chatArea.nativeElement.scrollHeight;
    const startPosition = this.chatArea.nativeElement.scrollTop;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.ease(timeElapsed, startPosition, distance, duration);
      this.chatArea.nativeElement.scrollTop = run;
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  ease(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.file = null;
    }
  }

  async sendMessage(message: string) {
    this.messages.push({ from: 'assistant', content: '', isLoading: true });
    await this.askQuestion(message);
    this.isGenerating = false;
  }

  truncateFilename(filename: string, maxLength: number = 20): string {
    if (filename.length > maxLength) {
      return filename.substring(0, maxLength - 3) + '...';
    }
    return filename;
  }

  toggleChatVisibility() {
    this.chatVisible = !this.chatVisible;
  }

  closeChat() {
    this.chatVisible = false;
  }

  removeFile() {
    this.file = null;
    this.resetFileInput();
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0] || null;
  }

  clearChat() {
    if (this.isGenerating && this.generationSubscription) {
      this.generationSubscription.unsubscribe();
      this.isGenerating = false;
    }

    this.prompt = '';
    this.messages = [];
    this.isChatPromptVisible = true;
    this.smoothScrollToBottom();
  }

  scrollLeft() {
    const itemWidth = this.nameLabels.nativeElement.children[0].offsetWidth;
    if (this.currentSuggestionIndex > 0) {
      this.currentSuggestionIndex--;
      const scrollAmount = -this.currentSuggestionIndex * itemWidth;
      this.nameLabels.nativeElement.style.transform = `translateX(${scrollAmount}px)`;
    }
  }

  scrollRight() {
    const itemWidth = this.nameLabels.nativeElement.children[0].offsetWidth;
    if (this.currentSuggestionIndex < this.suggestions.length - 1) {
      this.currentSuggestionIndex++;
      const scrollAmount = -this.currentSuggestionIndex * itemWidth;
      this.nameLabels.nativeElement.style.transform = `translateX(${scrollAmount}px)`;
    }
  }

  onScroll() {
    const scrollTop = this.chatArea.nativeElement.scrollTop;
    const threshold = 100;
    this.isChatHeaderVisible = scrollTop >= threshold;
  }

  selectSuggestion(suggestionMessage: string): void {
    this.inputText = suggestionMessage;
    this.prompt = suggestionMessage;
  }

  handleSubmitAction() {
    if (this.inputText.trim() || this.file) {
      this.onSubmit();
    } else {
      this.startVoiceCall();
    }
  }

  startVoiceCall() {
    this.isVoiceCallActive = true;
  }

  endVoiceCall() {
    this.isVoiceCallActive = false;
  }

  openWhatsApp() {
    const url =
      'https://wa.me/573108152369?text=Hola%20Poli%2C%20%C2%BFpuedes%20ayudarme%3F';
    window.open(url, '_blank');
  }
}
