export type BlockType =
  | 'heading'
  | 'text'
  | 'image'
  | 'carousel'
  | 'video'
  | 'rating'
  | 'reviews'
  | 'usage_guide'
  | 'badges'
  | 'timer'
  | 'divider'
  | 'accordion'
  | 'discount'
  | 'social_share'
  | 'spacer'
  | 'button';

export interface PageBlock {
  id: string;
  type: BlockType;
  props: any;
}

export interface BrandTheme {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  accent: string;
}

export const defaultTheme: BrandTheme = {
  primary: '#16A34A',
  secondary: '#F3F4F6',
  text: '#111827',
  background: '#FFFFFF',
  accent: '#F59E0B',
};

export const getDefaultProps = (type: BlockType): any => {
  switch (type) {
    case 'heading':
      return {
        text: 'Your Product Name',
        level: 'h1',
        align: 'left',
        color: '#111827',
        fontSize: '32px',
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: '0px',
        lineHeight: '1.2',
        paddingTop: '8px',
        paddingBottom: '8px',
      };
    case 'text':
      return {
        content: 'Describe your product here...',
        align: 'left',
        color: '#374151',
        fontSize: '16px',
        fontWeight: 'normal',
        lineHeight: '1.6',
        paddingTop: '4px',
        paddingBottom: '4px',
      };
    case 'image':
      return {
        images: ['https://placehold.co/600x400/e2e8f0/94a3b8?text=Image'],
        layout: 'single',
        borderRadius: 8,
        width: '100',
        objectFit: 'cover',
        showCaption: false,
        caption: '',
        paddingTop: '0px',
        paddingBottom: '0px',
      };
    case 'carousel':
      return {
        images: [
          { src: 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Slide+1', alt: 'Slide 1', caption: '' },
          { src: 'https://placehold.co/600x400/dbeafe/93c5fd?text=Slide+2', alt: 'Slide 2', caption: '' },
        ],
        autoPlay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        showCaptions: false,
        loop: true,
        borderRadius: 12,
        aspectRatio: '16/9',
      };
    case 'video':
      return {
        source: 'youtube',
        url: '',
        title: 'Watch: How to use this product',
        showTitle: true,
        autoPlay: false,
        muted: false,
        loop: false,
        controls: true,
        borderRadius: 12,
        aspectRatio: '16/9',
      };
    case 'rating':
      return {
        title: 'Rate this product',
        subtitle: 'How would you rate your experience?',
        maxStars: 5,
        starColor: '#FACC15',
        emptyStarColor: '#D1D5DB',
        starSize: '32px',
        allowHalf: false,
        showSubmitButton: true,
        submitLabel: 'Submit Rating',
        submitColor: '#16A34A',
        thankYouMessage: 'Thanks for your feedback!',
        align: 'center',
      };
    case 'reviews':
      return {
        title: 'Customer Reviews',
        mode: 'both',
        displayReviews: [
          {
            id: crypto.randomUUID(),
            name: 'Sarah M.',
            avatar: '',
            rating: 5,
            date: 'March 2026',
            text: 'Amazing product! Completely transformed my routine.',
            verified: true,
          },
        ],
        layout: 'cards',
        showVerifiedBadge: true,
        showRatingStars: true,
        starColor: '#FACC15',
        collectTitle: 'Write a Review',
        submitLabel: 'Submit Review',
        submitColor: '#16A34A',
        cardBackground: '#F9FAFB',
        cardBorderRadius: 12,
      };
    case 'usage_guide':
      return {
        title: 'How to Get Best Results',
        titleColor: '#111827',
        layout: 'list',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        items: [
          { id: crypto.randomUUID(), icon: '⏱', label: 'Best Time', value: 'Post workout, within 30 minutes', iconColor: '#16A34A', labelColor: '#6B7280', valueColor: '#111827' },
          { id: crypto.randomUUID(), icon: '🥄', label: 'Dosage', value: '1 scoop (30g) per serving', iconColor: '#16A34A', labelColor: '#6B7280', valueColor: '#111827' },
          { id: crypto.randomUUID(), icon: '💧', label: 'Mix With', value: '250ml cold water or milk', iconColor: '#16A34A', labelColor: '#6B7280', valueColor: '#111827' },
        ],
      };
    case 'badges':
      return {
        title: '',
        showTitle: false,
        layout: 'horizontal',
        items: [
          { id: crypto.randomUUID(), icon: '✅', iconType: 'emoji', label: 'Lab Tested', chipStyle: 'pill', chipBackground: '#F0FDF4', chipBorderColor: '#BBF7D0', textColor: '#166534', iconColor: '#16A34A', fontSize: '14px' },
          { id: crypto.randomUUID(), icon: '🏭', iconType: 'emoji', label: 'GMP Certified', chipStyle: 'pill', chipBackground: '#EFF6FF', chipBorderColor: '#BFDBFE', textColor: '#1E40AF', iconColor: '#3B82F6', fontSize: '14px' },
        ],
      };
    case 'timer':
      return {
        title: 'Offer Ends In',
        titleColor: '#DC2626',
        endDateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        style: 'bold',
        showLabels: true,
        labelsText: { days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs' },
        backgroundColor: '#FEF2F2',
        textColor: '#DC2626',
        borderRadius: 12,
        expiredMessage: 'Offer has ended',
        showSeconds: true,
      };
    case 'divider':
      return {
        style: 'solid',
        color: '#E5E7EB',
        gradientFrom: '#E5E7EB',
        gradientTo: '#FFFFFF',
        thickness: 1,
        width: '100',
        align: 'center',
        marginTop: 16,
        marginBottom: 16,
      };
    case 'accordion':
      return {
        title: 'Frequently Asked Questions',
        titleColor: '#111827',
        showTitle: true,
        allowMultiple: false,
        iconStyle: 'chevron',
        iconColor: '#6B7280',
        headerBackground: '#F9FAFB',
        headerTextColor: '#111827',
        bodyBackground: '#FFFFFF',
        bodyTextColor: '#374151',
        borderColor: '#E5E7EB',
        borderRadius: 8,
        items: [
          { id: crypto.randomUUID(), question: 'Is this product vegan?', answer: 'Yes, 100% plant-based and cruelty-free.', defaultOpen: false },
          { id: crypto.randomUUID(), question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days.', defaultOpen: false },
        ],
      };
    case 'discount':
      return {
        headline: '🎁 Get 20% Off Your Next Order',
        subtext: 'Use code at checkout. Limited time offer.',
        showSubtext: true,
        code: 'SAVE20',
        showCode: true,
        showCopyButton: true,
        copyLabel: 'Copy Code',
        ctaLabel: 'Shop Now',
        ctaUrl: '',
        ctaColor: '#16A34A',
        ctaTextColor: '#FFFFFF',
        backgroundColor: '#F0FDF4',
        borderColor: '#BBF7D0',
        headlineColor: '#166534',
        subtextColor: '#4B7A56',
        codeBackground: '#FFFFFF',
        codeTextColor: '#166534',
        borderRadius: 16,
      };
    case 'social_share':
      return {
        title: 'Share this product',
        showTitle: true,
        titleColor: '#111827',
        layout: 'horizontal',
        iconStyle: 'filled',
        iconSize: '32px',
        platforms: [
          { id: 'whatsapp', enabled: true, label: 'WhatsApp', customText: 'Check out this product!', customLink: '', usePageUrl: true, iconColor: '#25D366', backgroundColor: '#F0FFF4' },
          { id: 'instagram', enabled: true, label: 'Instagram', customText: '', customLink: '', usePageUrl: false, iconColor: '#E1306C', backgroundColor: '#FFF0F5' },
          { id: 'twitter', enabled: false, label: 'X (Twitter)', customText: '', customLink: '', usePageUrl: true, iconColor: '#000000', backgroundColor: '#F9FAFB' },
          { id: 'facebook', enabled: false, label: 'Facebook', customText: '', customLink: '', usePageUrl: true, iconColor: '#1877F2', backgroundColor: '#EFF6FF' },
          { id: 'copy_link', enabled: true, label: 'Copy Link', customText: '', customLink: '', usePageUrl: true, iconColor: '#6B7280', backgroundColor: '#F3F4F6' },
        ],
        gap: '12px',
      };
    case 'spacer':
      return { height: 24, showGuide: true };
    case 'button':
      return {
        label: 'Claim Discount',
        url: '',
        style: 'filled',
        fillColor: '#16A34A',
        textColor: '#FFFFFF',
        borderColor: '#16A34A',
        borderWidth: 2,
        borderRadius: 8,
        fontSize: '16px',
        fontWeight: 'semibold',
        width: 'full',
        align: 'center',
        paddingY: 12,
        icon: '',
        iconPosition: 'left',
        openInNewTab: true,
      };
    default:
      return {};
  }
};

export const defaultTemplates: Record<string, PageBlock[]> = {
  Supplement: [
    { id: crypto.randomUUID(), type: 'carousel', props: { ...getDefaultProps('carousel') } },
    { id: crypto.randomUUID(), type: 'heading', props: { ...getDefaultProps('heading'), text: 'Premium Whey Protein', align: 'center', fontSize: '28px' } },
    { id: crypto.randomUUID(), type: 'rating', props: { ...getDefaultProps('rating') } },
    { id: crypto.randomUUID(), type: 'usage_guide', props: { ...getDefaultProps('usage_guide') } },
    { id: crypto.randomUUID(), type: 'badges', props: { ...getDefaultProps('badges') } },
    { id: crypto.randomUUID(), type: 'discount', props: { ...getDefaultProps('discount'), headline: '🎁 Get 20% Off — Use REPEAT20', code: 'REPEAT20' } },
    { id: crypto.randomUUID(), type: 'button', props: { ...getDefaultProps('button'), label: 'Claim 20% Discount', icon: '🛒' } },
  ],
  Skincare: [
    { id: crypto.randomUUID(), type: 'image', props: { ...getDefaultProps('image') } },
    { id: crypto.randomUUID(), type: 'heading', props: { ...getDefaultProps('heading'), text: 'Glow Serum', align: 'left', fontSize: '28px' } },
    { id: crypto.randomUUID(), type: 'text', props: { ...getDefaultProps('text'), content: 'Awaken your skin with our vitamin-C enriched glowing serum. Perfect for your morning routine.' } },
    { id: crypto.randomUUID(), type: 'usage_guide', props: { ...getDefaultProps('usage_guide'), title: 'Application Steps' } },
    { id: crypto.randomUUID(), type: 'reviews', props: { ...getDefaultProps('reviews') } },
    { id: crypto.randomUUID(), type: 'timer', props: { ...getDefaultProps('timer'), title: 'Flash Sale Ends In' } },
    { id: crypto.randomUUID(), type: 'button', props: { ...getDefaultProps('button'), label: 'Buy Again', fillColor: '#000000' } },
  ],
  'Food & Drink': [
    { id: crypto.randomUUID(), type: 'image', props: { ...getDefaultProps('image') } },
    { id: crypto.randomUUID(), type: 'heading', props: { ...getDefaultProps('heading'), text: 'Single Origin Blend', align: 'center', fontSize: '28px' } },
    { id: crypto.randomUUID(), type: 'text', props: { ...getDefaultProps('text'), content: '100% Arabica beans roasted to perfection.', align: 'center' } },
    { id: crypto.randomUUID(), type: 'video', props: { ...getDefaultProps('video'), title: 'Our roasting process' } },
    { id: crypto.randomUUID(), type: 'badges', props: { ...getDefaultProps('badges'), items: [
      { id: crypto.randomUUID(), icon: '🌱', label: 'Organic', chipStyle: 'pill', chipBackground: '#F0FDF4', chipBorderColor: '#BBF7D0', textColor: '#166534', iconColor: '#16A34A', fontSize: '14px' },
      { id: crypto.randomUUID(), icon: '🤝', label: 'Fair Trade', chipStyle: 'pill', chipBackground: '#FEF3C7', chipBorderColor: '#FDE68A', textColor: '#92400E', iconColor: '#F59E0B', fontSize: '14px' },
    ]}},
    { id: crypto.randomUUID(), type: 'discount', props: { ...getDefaultProps('discount'), headline: '☕ Never Run Out', code: 'COFFEE15', backgroundColor: '#FFFBEB', borderColor: '#F59E0B', ctaLabel: 'Subscribe & Save' } },
    { id: crypto.randomUUID(), type: 'button', props: { ...getDefaultProps('button'), label: 'Subscribe & Save 15%', fillColor: '#B45309' } },
  ],
};
