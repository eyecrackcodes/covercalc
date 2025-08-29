"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Calculator } from "lucide-react";

interface CalculatorInputs {
  closeRate: number;
  placeRate: number;
  avgAnnualPremium: number;
  leadsPerAgentPerDay: number;
  workingDaysPerMonth: number;
  agentHeadcount: number;
  totalOverhead: number;
  commissionRate: number;
  avgLeadCost: number;
  agentOutagePercent: number;
}

const AgentProfitabilityCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    closeRate: 20,
    placeRate: 80,
    avgAnnualPremium: 1200,
    leadsPerAgentPerDay: 5,
    workingDaysPerMonth: 21,
    agentHeadcount: 50,
    totalOverhead: 1000000,
    commissionRate: 140,
    avgLeadCost: 50,
    agentOutagePercent: 10,
  });

  // Calculate agent metrics
  const calculations = useMemo(() => {
    const monthlyLeadsPerAgent =
      inputs.leadsPerAgentPerDay * inputs.workingDaysPerMonth;
    
    // Apply agent outage factor - reduces effective leads taken
    const effectiveLeadsPerAgent = monthlyLeadsPerAgent * (1 - inputs.agentOutagePercent / 100);
    
    const closesPerAgent = effectiveLeadsPerAgent * (inputs.closeRate / 100);
    const placedPoliciesPerAgent = closesPerAgent * (inputs.placeRate / 100);
    const commissionRevenuePerAgent =
      placedPoliciesPerAgent *
      (inputs.commissionRate / 100) *
      inputs.avgAnnualPremium;
    
    // Calculate lead cost per agent (based on total leads, not effective leads)
    const leadCostPerAgent = monthlyLeadsPerAgent * inputs.avgLeadCost;
    
    // Overhead expense per agent
    const overheadPerAgent =
      inputs.agentHeadcount > 0
        ? inputs.totalOverhead / inputs.agentHeadcount
        : 0;
    
    // Total expense includes overhead + lead costs
    const totalExpensePerAgent = overheadPerAgent + leadCostPerAgent;
    
    const profitPerAgent = commissionRevenuePerAgent - totalExpensePerAgent;
    const profitMargin =
      commissionRevenuePerAgent > 0
        ? (profitPerAgent / commissionRevenuePerAgent) * 100
        : 0;

    // Break-even calculations with safety checks
    const breakEvenDenominator1 =
      effectiveLeadsPerAgent *
      (inputs.placeRate / 100) *
      (inputs.commissionRate / 100) *
      inputs.avgAnnualPremium;
    const breakEvenCloseRate =
      breakEvenDenominator1 > 0
        ? (totalExpensePerAgent / breakEvenDenominator1) * 100
        : 0;

    const breakEvenDenominator2 =
      closesPerAgent * (inputs.commissionRate / 100) * inputs.avgAnnualPremium;
    const breakEvenPlaceRate =
      breakEvenDenominator2 > 0
        ? (totalExpensePerAgent / breakEvenDenominator2) * 100
        : 0;

    const breakEvenDenominator3 =
      placedPoliciesPerAgent * (inputs.commissionRate / 100);
    const breakEvenPremium =
      breakEvenDenominator3 > 0 ? totalExpensePerAgent / breakEvenDenominator3 : 0;

    const breakEvenDenominator4 =
      (inputs.closeRate / 100) *
      (inputs.placeRate / 100) *
      (inputs.commissionRate / 100) *
      inputs.avgAnnualPremium *
      inputs.workingDaysPerMonth *
      (1 - inputs.agentOutagePercent / 100);
    const breakEvenLeadsPerDay =
      breakEvenDenominator4 > 0 ? totalExpensePerAgent / breakEvenDenominator4 : 0;

    return {
      monthlyLeadsPerAgent,
      effectiveLeadsPerAgent,
      closesPerAgent,
      placedPoliciesPerAgent,
      commissionRevenuePerAgent,
      overheadPerAgent,
      leadCostPerAgent,
      totalExpensePerAgent,
      profitPerAgent,
      profitMargin,
      breakEvenCloseRate,
      breakEvenPlaceRate,
      breakEvenPremium,
      breakEvenLeadsPerDay,
    };
  }, [inputs]);

  // Generate sensitivity analysis data
  const generateSensitivityData = (
    variable: keyof CalculatorInputs,
    range: number[]
  ) => {
    return range.map((value) => {
      const tempInputs = { ...inputs, [variable]: value };
      const monthlyLeadsPerAgent =
        tempInputs.leadsPerAgentPerDay * tempInputs.workingDaysPerMonth;
      const effectiveLeadsPerAgent = 
        monthlyLeadsPerAgent * (1 - tempInputs.agentOutagePercent / 100);
      const closesPerAgent =
        effectiveLeadsPerAgent * (tempInputs.closeRate / 100);
      const placedPoliciesPerAgent =
        closesPerAgent * (tempInputs.placeRate / 100);
      const commissionRevenuePerAgent =
        placedPoliciesPerAgent *
        (tempInputs.commissionRate / 100) *
        tempInputs.avgAnnualPremium;
      const leadCostPerAgent = monthlyLeadsPerAgent * tempInputs.avgLeadCost;
      const overheadPerAgent =
        tempInputs.agentHeadcount > 0
          ? tempInputs.totalOverhead / tempInputs.agentHeadcount
          : 0;
      const totalExpensePerAgent = overheadPerAgent + leadCostPerAgent;
      const profitPerAgent = commissionRevenuePerAgent - totalExpensePerAgent;

      return {
        value,
        profit: Math.round(profitPerAgent),
      };
    });
  };

  const closeRateData = generateSensitivityData(
    "closeRate",
    [10, 15, 20, 25, 30]
  );
  const placeRateData = generateSensitivityData(
    "placeRate",
    [60, 70, 80, 90, 100]
  );
  const premiumData = generateSensitivityData(
    "avgAnnualPremium",
    [800, 1000, 1200, 1400, 1600]
  );
  const leadsData = generateSensitivityData(
    "leadsPerAgentPerDay",
    [3, 4, 5, 6, 7]
  );
  const outageData = generateSensitivityData(
    "agentOutagePercent",
    [0, 5, 10, 15, 20]
  );
  const leadCostData = generateSensitivityData(
    "avgLeadCost",
    [25, 50, 75, 100, 125]
  );

  const handleInputChange = (
    key: keyof CalculatorInputs,
    value: string | number[]
  ) => {
    // For sliders, always use the array value
    if (Array.isArray(value)) {
      setInputs((prev) => ({ ...prev, [key]: value[0] }));
      return;
    }

    // For text inputs, allow empty string during typing
    const strValue = value as string;
    if (strValue === "") {
      // Use minimum valid values for empty inputs
      const minValues: Partial<CalculatorInputs> = {
        agentHeadcount: 1,
        workingDaysPerMonth: 1,
        leadsPerAgentPerDay: 0,
        commissionRate: 0,
        totalOverhead: 0,
        avgAnnualPremium: 0,
        closeRate: 0,
        placeRate: 0,
        avgLeadCost: 0,
        agentOutagePercent: 0,
      };
      setInputs((prev) => ({ ...prev, [key]: minValues[key] || 0 }));
      return;
    }

    let numValue = parseFloat(strValue);
    if (isNaN(numValue)) return; // Don't update if not a valid number

    // Ensure minimum values for critical inputs
    if (key === "agentHeadcount" && numValue < 1) numValue = 1;
    if (key === "workingDaysPerMonth" && numValue < 1) numValue = 1;
    if (key === "leadsPerAgentPerDay" && numValue < 0) numValue = 0;
    if (key === "commissionRate" && numValue < 0) numValue = 0;
    if (key === "totalOverhead" && numValue < 0) numValue = 0;
    if (key === "avgAnnualPremium" && numValue < 0) numValue = 0;
    if (key === "avgLeadCost" && numValue < 0) numValue = 0;
    if (key === "agentOutagePercent" && numValue < 0) numValue = 0;
    if (key === "agentOutagePercent" && numValue > 100) numValue = 100;

    setInputs((prev) => ({ ...prev, [key]: numValue }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    if (value > 999) return ">999%";
    return `${value.toFixed(1)}%`;
  };

  const formatBreakEvenValue = (
    value: number,
    type: "percent" | "currency" | "number"
  ) => {
    if (value === 0) return "N/A";
    if (type === "percent") {
      if (value > 100) return ">100%";
      return formatPercent(value);
    }
    if (type === "currency") {
      if (value > 99999) return ">$99,999";
      return formatCurrency(value);
    }
    if (value > 999) return ">999";
    return value.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Agent Profitability Calculator
          </CardTitle>
          <CardDescription>
            Calculate and analyze agent-level profitability in your final
            expense life insurance call center
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="closeRate">Close Rate (%)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="closeRate"
                  min={5}
                  max={50}
                  step={1}
                  value={[inputs.closeRate]}
                  onValueChange={(value) =>
                    handleInputChange("closeRate", value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={inputs.closeRate || ""}
                  onChange={(e) =>
                    handleInputChange("closeRate", e.target.value)
                  }
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeRate">Place Rate (%)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="placeRate"
                  min={40}
                  max={100}
                  step={1}
                  value={[inputs.placeRate]}
                  onValueChange={(value) =>
                    handleInputChange("placeRate", value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={inputs.placeRate || ""}
                  onChange={(e) =>
                    handleInputChange("placeRate", e.target.value)
                  }
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgAnnualPremium">
                Average Annual Premium ($)
              </Label>
              <Input
                id="avgAnnualPremium"
                type="number"
                value={inputs.avgAnnualPremium || ""}
                onChange={(e) =>
                  handleInputChange("avgAnnualPremium", e.target.value)
                }
                placeholder="e.g. 1200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadsPerAgentPerDay">
                Leads per Agent per Day
              </Label>
              <Input
                id="leadsPerAgentPerDay"
                type="number"
                value={inputs.leadsPerAgentPerDay || ""}
                onChange={(e) =>
                  handleInputChange("leadsPerAgentPerDay", e.target.value)
                }
                placeholder="e.g. 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingDaysPerMonth">
                Working Days per Month
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="workingDaysPerMonth"
                  min={15}
                  max={23}
                  step={1}
                  value={[inputs.workingDaysPerMonth]}
                  onValueChange={(value) =>
                    handleInputChange("workingDaysPerMonth", value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={inputs.workingDaysPerMonth || ""}
                  onChange={(e) =>
                    handleInputChange("workingDaysPerMonth", e.target.value)
                  }
                  className="w-20"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Typical month: 22 days (weekdays) - 1 day (holidays) = 21
                working days
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentHeadcount">Agent Headcount</Label>
              <Input
                id="agentHeadcount"
                type="number"
                value={inputs.agentHeadcount || ""}
                onChange={(e) =>
                  handleInputChange("agentHeadcount", e.target.value)
                }
                placeholder="e.g. 50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalOverhead">Total Monthly Overhead ($)</Label>
              <select
                id="totalOverhead"
                value={inputs.totalOverhead}
                onChange={(e) =>
                  handleInputChange("totalOverhead", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-background"
              >
                {Array.from({ length: 61 }, (_, i) => 1000000 + i * 50000).map(
                  (value) => (
                    <option key={value} value={value}>
                      {formatCurrency(value)}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgLeadCost">Average Lead Cost ($)</Label>
              <Input
                id="avgLeadCost"
                type="number"
                value={inputs.avgLeadCost || ""}
                onChange={(e) =>
                  handleInputChange("avgLeadCost", e.target.value)
                }
                placeholder="e.g. 50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentOutagePercent">Agent Outage (%)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="agentOutagePercent"
                  min={0}
                  max={30}
                  step={1}
                  value={[inputs.agentOutagePercent]}
                  onValueChange={(value) =>
                    handleInputChange("agentOutagePercent", value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={inputs.agentOutagePercent || ""}
                  onChange={(e) =>
                    handleInputChange("agentOutagePercent", e.target.value)
                  }
                  className="w-20"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Accounts for sick days, training, meetings, etc.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  Monthly Leads per Agent
                </span>
                <span className="font-semibold">
                  {calculations.monthlyLeadsPerAgent.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <span className="text-sm font-medium">Effective Leads (after outage)</span>
                <span className="font-semibold text-orange-700 dark:text-orange-400">
                  {calculations.effectiveLeadsPerAgent.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Closes per Agent</span>
                <span className="font-semibold">
                  {calculations.closesPerAgent.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  Placed Policies per Agent
                </span>
                <span className="font-semibold">
                  {calculations.placedPoliciesPerAgent.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  Commission Revenue per Agent
                </span>
                <span className="font-semibold">
                  {formatCurrency(calculations.commissionRevenuePerAgent)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Overhead per Agent</span>
                <span className="font-semibold">
                  {formatCurrency(calculations.overheadPerAgent)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <span className="text-sm font-medium">Lead Cost per Agent</span>
                <span className="font-semibold text-purple-700 dark:text-purple-400">
                  {formatCurrency(calculations.leadCostPerAgent)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Total Expense per Agent</span>
                <span className="font-semibold">
                  {formatCurrency(calculations.totalExpensePerAgent)}
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-3 rounded-lg ${
                  calculations.profitPerAgent >= 0
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-red-100 dark:bg-red-900/20"
                }`}
              >
                <span className="text-sm font-medium flex items-center gap-2">
                  Profit per Agent
                  {calculations.profitPerAgent >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </span>
                <span
                  className={`font-bold ${
                    calculations.profitPerAgent >= 0
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(calculations.profitPerAgent)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Break-Even Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Minimum Close Rate</span>
                <span className="font-semibold">
                  {formatBreakEvenValue(
                    calculations.breakEvenCloseRate,
                    "percent"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Minimum Place Rate</span>
                <span className="font-semibold">
                  {formatBreakEvenValue(
                    calculations.breakEvenPlaceRate,
                    "percent"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  Minimum Annual Premium
                </span>
                <span className="font-semibold">
                  {formatBreakEvenValue(
                    calculations.breakEvenPremium,
                    "currency"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  Minimum Leads per Day
                </span>
                <span className="font-semibold">
                  {formatBreakEvenValue(
                    calculations.breakEvenLeadsPerDay,
                    "number"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <span className="text-sm font-medium">Profit Margin</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  {calculations.commissionRevenuePerAgent > 0
                    ? `${calculations.profitMargin.toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sensitivity Analysis</CardTitle>
          <CardDescription>
            See how changes in each variable affect agent profitability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tables" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="tables" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Close Rate Sensitivity</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Close Rate (%)</TableHead>
                        <TableHead className="text-right">
                          Profit per Agent
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {closeRateData.map((row) => (
                        <TableRow key={row.value}>
                          <TableCell>{row.value}%</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              row.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(row.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Place Rate Sensitivity</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Place Rate (%)</TableHead>
                        <TableHead className="text-right">
                          Profit per Agent
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {placeRateData.map((row) => (
                        <TableRow key={row.value}>
                          <TableCell>{row.value}%</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              row.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(row.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Premium Sensitivity</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Avg Annual Premium</TableHead>
                        <TableHead className="text-right">
                          Profit per Agent
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {premiumData.map((row) => (
                        <TableRow key={row.value}>
                          <TableCell>{formatCurrency(row.value)}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              row.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(row.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">
                    Daily Leads Sensitivity
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leads per Day</TableHead>
                        <TableHead className="text-right">
                          Profit per Agent
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadsData.map((row) => (
                        <TableRow key={row.value}>
                          <TableCell>{row.value}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              row.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(row.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Agent Outage Sensitivity</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Outage (%)</TableHead>
                        <TableHead className="text-right">
                          Profit per Agent
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outageData.map((row) => (
                        <TableRow key={row.value}>
                          <TableCell>{row.value}%</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              row.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(row.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Lead Cost Sensitivity</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead Cost ($)</TableHead>
                        <TableHead className="text-right">
                          Profit per Agent
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadCostData.map((row) => (
                        <TableRow key={row.value}>
                          <TableCell>{formatCurrency(row.value)}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              row.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(row.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Close Rate Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={closeRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="value"
                          label={{
                            value: "Close Rate (%)",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Profit ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Place Rate Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={placeRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="value"
                          label={{
                            value: "Place Rate (%)",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Profit ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Premium Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={premiumData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="value"
                          label={{
                            value: "Annual Premium ($)",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Profit ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#ffc658"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Daily Leads Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={leadsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="value"
                          label={{
                            value: "Leads per Day",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Profit ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#ff8042"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Agent Outage Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={outageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="value"
                          label={{
                            value: "Outage (%)",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Profit ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lead Cost Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={leadCostData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="value"
                          label={{
                            value: "Lead Cost ($)",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Profit ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#ec4899"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentProfitabilityCalculator;
