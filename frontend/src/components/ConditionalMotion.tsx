import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConditionalMotionProps extends MotionProps {
  children: ReactNode;
  as?: keyof typeof motion;
}

export const ConditionalMotion = ({ 
  children, 
  as = "div",
  ...motionProps 
}: ConditionalMotionProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    const Component = as;
    const { className, style } = motionProps as any;
    return <Component className={className} style={style}>{children}</Component>;
  }
  
  const MotionComponent = motion[as];
  return <MotionComponent {...motionProps}>{children}</MotionComponent>;
};
