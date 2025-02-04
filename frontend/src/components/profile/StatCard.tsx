import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  prefix?: string;
}

export const StatCard = ({ label, value, prefix = "" }: StatCardProps) => {
  return (
    <Card className="bg-primary/5">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-2xl font-bold">
            {prefix}
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
