import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  prefix?: string;
}

export const StatCard = ({ label, value, prefix = "" }: StatCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-muted hover:scale-105 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {label}
          </span>
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            {prefix}
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
