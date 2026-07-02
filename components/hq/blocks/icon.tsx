import {
  Sparkles, Zap, Shield, Rocket, Star, Check, CircleCheck, Users, Mail, Phone,
  Clock, Calendar, BarChart3, TrendingUp, Award, Heart, Globe, Lock, Bot, Cpu,
  Cloud, Code, Layers, Target, Lightbulb, MessageCircle, Settings, Gauge,
  Building2, ThumbsUp, Wrench, LineChart, Circle,
  LayoutGrid, ListOrdered, CircleDollarSign, Quote, HelpCircle, Megaphone,
  AlignLeft, Images, Type, Image as ImageIcon, Columns3, MoveVertical, AppWindow,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Sparkles, Zap, Shield, Rocket, Star, Check, CircleCheck, Users, Mail, Phone,
  Clock, Calendar, BarChart3, TrendingUp, Award, Heart, Globe, Lock, Bot, Cpu,
  Cloud, Code, Layers, Target, Lightbulb, MessageCircle, Settings, Gauge,
  Building2, ThumbsUp, Wrench, LineChart,
  LayoutGrid, ListOrdered, CircleDollarSign, Quote, HelpCircle, Megaphone,
  AlignLeft, Images, Type, Image: ImageIcon, Columns3, MoveVertical, AppWindow,
};

export function Icon({ name, className }: { name?: string; className?: string }) {
  const C = (name && MAP[name]) || Circle;
  return <C className={className} />;
}
