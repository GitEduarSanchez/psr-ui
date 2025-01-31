import { OpenaiService } from '../openai.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MessageSuggestionService } from '../../core/services/message-suggestion.service';
import { Suggestion } from '../../core/interfaces/suggestion.interface';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface Message {
  from: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  isError?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [FormsModule, CommonModule],
  animations: [
    trigger('toggleChat', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('0.5s ease-in-out')
      ]),
      transition('visible => hidden', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})

export class ChatComponent implements OnInit {
  prompt: string = '';
  messages: Message[] = [];
  isChatHeaderVisible: boolean = false;
  isChatPromptVisible: boolean = true;
  isGenerating: boolean = false;

  suggestions: Suggestion[] = [];
  currentSuggestionIndex: number = 0;
  chatVisible: boolean = false;
  public translations: any;
  public viewType: string = 'fullChat';
  public folderId: string | null = null;
  private generationSubscription!: Subscription;

  @ViewChild('chatArea') chatArea!: ElementRef;
  @ViewChild('nameLabels') nameLabels!: ElementRef;

  constructor(
    private openaiService: OpenaiService,
    private messageSuggestionService: MessageSuggestionService,
    private translationService: TranslationService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.folderId = this.route.snapshot.paramMap.get('folderId');
    this.viewType = this.route.snapshot.data['viewType'] || 'modalChat';
    this.translations = this.translationService.getTranslations();

    if (this.viewType === 'modalChat') {
      this.updateSuggestions();
  
      this.messageSuggestionService.getAllSuggestions().subscribe({
        next: (suggestions: Suggestion[]) => {
          if (suggestions && suggestions.length > 0) {
            this.suggestions = suggestions;
          }
        },
        error: (err) => {
          console.error('Error getting hints:', err);
        }
      });
    }

    this.translationService.selectedLanguage$.subscribe(() => {
      this.translations = this.translationService.getTranslations();
    });
  }

  updateSuggestions() {
    this.suggestions = [
      { id: 1, message: this.translations?.reduceConsumption || "How can consumption be reduced efficiently?" },
      { id: 2, message: this.translations?.optimizeResources || "Suggestions to optimize resource usage at home" },
      { id: 3, message: this.translations?.environmentalImpact || "What is the environmental impact of resource consumption?" }
    ];
  }

  toggleChatVisibility(): void {
    this.chatVisible = !this.chatVisible;
  }

  closeChat() {
    this.chatVisible = false;
  }

  public goBack(): void {
    this.location.back();
  }

  sendPrompt() {
    if (!this.prompt.trim() || this.isGenerating) return;

    this.messages.push({ from: 'user', content: this.prompt.trim() });

    const currentPrompt = this.prompt.trim();
    this.prompt = '';
    this.smoothScrollToBottom();
    this.isChatPromptVisible = false;

    this.messages.push({ from: 'assistant', content: '', isLoading: true });

    this.isGenerating = true;

    this.generationSubscription = this.openaiService.generatePrompt(currentPrompt, this.folderId ?? '').subscribe({
      next: (res) => {
        const lastMessage = this.messages[this.messages.length - 1];
        lastMessage.content = res.data.response;
        lastMessage.isLoading = false;
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('Error generating response:', err);
        const lastMessage = this.messages[this.messages.length - 1];
        lastMessage.content = this.translations?.errorGeneratingResponse || 'There was an error generating the response. Please try again.';
        lastMessage.isLoading = false;
        lastMessage.isError = true;
        this.isGenerating = false;
      }
    });
  }
  
  smoothScrollToBottom() {
    setTimeout(() => {
      const element = this.chatArea?.nativeElement;
      element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }, 0);
  }

  ease(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  onScroll() {
    const scrollTop = this.chatArea.nativeElement.scrollTop;
    const threshold = 100;
    this.isChatHeaderVisible = scrollTop > threshold;
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

  ngOnDestroy() {
    if (this.generationSubscription) {
      this.generationSubscription.unsubscribe();
    }
  }

  selectSuggestion(suggestionMessage: string): void {
    this.prompt = suggestionMessage;
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
}
