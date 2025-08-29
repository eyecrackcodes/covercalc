# Agent Profitability Calculator

A comprehensive calculator for analyzing agent-level profitability in final expense life insurance call centers.

## Features

- **Real-time Calculations**: Instantly see how changes in variables affect profitability
- **Interactive Controls**: Use sliders and inputs to adjust parameters
- **Working Days Calculation**: Factor in weekends and holidays for accurate monthly projections
- **Lead Cost Tracking**: Separate marketing spend from general overhead for clearer expense analysis
- **Agent Outage Factor**: Account for realistic agent availability (sick days, training, meetings)
- **Key Metrics Display**: Track monthly leads, effective leads, closes, placed policies, revenue, expenses breakdown, and profit per agent
- **Break-Even Analysis**: Understand minimum requirements to achieve profitability with all factors considered
- **Sensitivity Analysis**: View how each variable impacts profit through tables and charts, including outage and lead cost impacts
- **Visual Charts**: Interactive charts showing the relationship between all variables and profitability

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
2. **Effective leads per agent** = monthly leads × (1 - agent outage % / 100)
3. **Closes per agent** = effective leads per agent × (close rate / 100)
4. **Placed policies per agent** = closes per agent × (place rate / 100)
5. **Commission revenue per agent** = placed policies per agent × (commission rate / 100) × average annual premium
6. **Lead cost per agent** = monthly leads per agent × average lead cost
7. **Overhead per agent** = total overhead / agent headcount
8. **Total expense per agent** = overhead per agent + lead cost per agent
9. **Profit per agent** = commission revenue per agent - total expense per agent

### Break-Even Analysis

- **Minimum Close Rate** = (total expense per agent) / (effective leads per agent × (place rate / 100) × (commission rate / 100) × average annual premium) × 100
- **Minimum Place Rate** = (total expense per agent) / (closes per agent × (commission rate / 100) × average annual premium) × 100
- **Minimum Premium** = total expense per agent / (placed policies per agent × (commission rate / 100))
- **Minimum Leads per Day** = total expense per agent / ((close rate / 100) × (place rate / 100) × (commission rate / 100) × average annual premium × working days per month × (1 - agent outage % / 100))

## Default Values

- **Close Rate**: 20%
- **Place Rate**: 80%
- **Average Annual Premium**: $1,200
- **Leads per Agent per Day**: 5
- **Working Days per Month**: 21 (accounts for weekends and holidays)
- **Agent Headcount**: 50
- **Total Overhead**: $1,000,000
- **Commission Rate**: 140%
- **Average Lead Cost**: $50
- **Agent Outage**: 10% (accounts for sick days, training, meetings, etc.)

## Technologies Used

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Lucide React for icons
