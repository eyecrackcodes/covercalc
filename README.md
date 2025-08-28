# Agent Profitability Calculator

A comprehensive calculator for analyzing agent-level profitability in final expense life insurance call centers.

## Features

- **Real-time Calculations**: Instantly see how changes in variables affect profitability
- **Interactive Controls**: Use sliders and inputs to adjust parameters
- **Working Days Calculation**: Factor in weekends and holidays for accurate monthly projections
- **Key Metrics Display**: Track monthly leads, closes, placed policies, revenue, expenses, and profit per agent
- **Break-Even Analysis**: Understand minimum requirements to achieve profitability
- **Sensitivity Analysis**: View how each variable impacts profit through tables and charts
- **Visual Charts**: Interactive charts showing the relationship between variables and profitability

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Formulas

### Agent Profitability Calculations

1. **Monthly leads per agent** = leads per day × working days per month
2. **Closes per agent** = monthly leads per agent × (close rate / 100)
3. **Placed policies per agent** = closes per agent × (place rate / 100)
4. **Commission revenue per agent** = placed policies per agent × (commission rate / 100) × average annual premium
5. **Expense per agent** = total overhead / agent headcount
6. **Profit per agent** = commission revenue per agent - expense per agent

### Break-Even Analysis

- **Minimum Close Rate** = (expense per agent) / (monthly leads per agent × (place rate / 100) × (commission rate / 100) × average annual premium) × 100
- **Minimum Place Rate** = (expense per agent) / (closes per agent × (commission rate / 100) × average annual premium) × 100
- **Minimum Premium** = expense per agent / (placed policies per agent × (commission rate / 100))
- **Minimum Leads per Day** = expense per agent / ((close rate / 100) × (place rate / 100) × (commission rate / 100) × average annual premium × working days per month)

## Default Values

- **Close Rate**: 20%
- **Place Rate**: 80%
- **Average Annual Premium**: $1,200
- **Leads per Agent per Day**: 5
- **Working Days per Month**: 21 (accounts for weekends and holidays)
- **Agent Headcount**: 50
- **Total Overhead**: $1,000,000
- **Commission Rate**: 140%

## Technologies Used

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Lucide React for icons
