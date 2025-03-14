import {
  Terminal,
  MailWarning,
  Timer,
  Lock,
  UserX,
  AlertTriangle,
} from 'lucide-react';

export const components: {
  title: string;
  href: string;
  description: string;
  pro: boolean;
}[] = [
  {
    title: 'Favorite Genres',
    href: '/docs/primitives/alert-dialog',
    description:
      'Discover your top genres and find more tracks that match your vibe.',
    pro: false,
  },
  {
    title: 'Charts',
    href: '/docs/primitives/hover-card',
    description:
      'Explore your weekly vibe – see how your music shifts from day to day.',
    pro: false,
  },
  {
    title: 'Listening Time',
    href: '/docs/primitives/progress',
    description:
      'Track your total listening time and see your most dedicated music moments.',
    pro: false,
  },
  {
    title: 'Favorite Songs',
    href: '/docs/primitives/scroll-area',
    description:
      "Discover your all-time favorite songs, the ones you can't stop playing!",
    pro: false,
  },
  {
    title: 'Monthly Recap',
    href: '/docs/primitives/tabs',
    description:
      'Relive your month in music—your top tracks and artists all in one place!',
    pro: true,
  },
  {
    title: 'AI Recomendation',
    href: '/docs/primitives/tooltip',
    description:
      'Get personalized music suggestions based on your unique taste.',
    pro: true,
  },
];

export const errorsData = [
  {
    code: 'provider_email_needs_verification',
    title: 'Verify your email',
    description:
      'Please check your inbox and verify your email address to continue.',
    icon: MailWarning,
  },
  {
    code: 'over_email_send_rate_limit',
    title: 'Too many requests',
    description:
      'You can request a new email in a few moments. Please wait and try again later.',
    icon: Timer,
  },
  {
    code: 'invalid_grant',
    title: 'Login failed',
    description:
      'The login credentials you entered are incorrect. Please try again.',
    icon: Lock,
  },
  {
    code: 'user_not_found',
    title: 'User not found',
    description:
      'No account is associated with this email. Please check your email or sign up.',
    icon: UserX,
  },
  {
    code: 'server_error',
    title: 'Oops! Something went wrong',
    description: 'We encountered a server issue. Please try again later.',
    icon: AlertTriangle,
  },
];
