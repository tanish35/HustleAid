import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type VerificationItem = {
  label: string;
  isVerified: boolean;
};

type VerificationProgressProps = {
  items: VerificationItem[];
};

export const VerificationProgress = ({ items }: VerificationProgressProps) => {
  const progress = (items.filter(item => item.isVerified).length / items.length) * 100;

  return (
    <section className="space-y-6" aria-label="Verification Status">
      <div>
        <div className="flex justify-between mb-2">
          <h2 className="text-sm font-medium">Verification Progress</h2>
          <span className="text-sm font-medium" aria-label={`${progress}% complete`}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <ul className="space-y-4">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              {item.isVerified ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="group-hover:text-emphasis">{item.label}</span>
            </div>
            <span 
              className={`${
                item.isVerified ? "text-green-500" : "text-destructive"
              } font-medium`}
              aria-label={item.isVerified ? "Verified" : "Not Verified"}
            >
              {item.isVerified ? "Verified" : "Not Verified"}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};
