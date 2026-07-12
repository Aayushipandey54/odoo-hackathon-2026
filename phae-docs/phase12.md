# Phase 12 — AI Copilot & Intelligent Enterprise Assistant (Optional Bonus)

Version: 1.0

---

# Objective

Build an enterprise AI Copilot that assists users in interacting with AssetFlow using natural language.

The AI should not replace the ERP.

Instead, it should become another interface that uses existing business services through secure tool calling.

The AI must never bypass business rules, RBAC, workflows, or database constraints.

This phase is optional and should only begin after every previous phase has been completed and deployed successfully.

---

# Dependencies

Required Documents

- 01_CONTEXT.md
- 02_PRODUCT_REQUIREMENTS.md
- 03_SYSTEM_ARCHITECTURE.md
- 05_API_AND_BACKEND_GUIDE.md
- 06_SECURITY_AND_ENGINEERING_RULES.md
- 08_AI_AND_IMPLEMENTATION_GUIDE.md

Required Previous Phases

- Phase 01 → Phase 11

---

# Business Context

Enterprise users often struggle to navigate complex ERP systems.

Instead of searching multiple menus, users should be able to interact using natural language.

Examples

"Show all laptops assigned to Engineering."

"Who has MacBook MB-104?"

"Reserve Meeting Room B tomorrow at 3 PM."

"Create a maintenance request for Projector P-14."

"What assets are due for audit?"

The AI should improve usability while respecting all business rules.

---

# Technical Scope

This phase includes

- AI Chat Interface
- Tool Calling
- Intent Detection
- Natural Language Search
- AI Action Confirmation
- Context Awareness
- Conversation History
- Streaming Responses
- Function Calling
- Permission-aware Responses

---

# Out of Scope

Do NOT implement

- RAG
- Vector Database
- Autonomous Agents
- AI Decision Making
- Database Access from AI

The AI must never become the source of truth.

---

# Architecture Decisions

The AI acts as an interface.

Architecture

User

↓

AI Copilot

↓

LangChain.js Agent

↓

Tool Calling

↓

Existing Business Services

↓

Database

The AI never talks directly to PostgreSQL.

---

# AI Technology Stack

Framework

LangChain.js

LLM

Groq API

Model

Llama 3.3 / Qwen / DeepSeek (choose based on benchmark at implementation time)

Communication

Streaming Responses

Backend

Express.js

---

# Tool Calling

Every ERP capability exposed to AI must exist as a tool.

Examples

Search Assets

Search Employees

Create Booking

Check Availability

Create Maintenance Request

Allocate Asset

Return Asset

Generate Report

Read Notifications

Get Dashboard Metrics

The AI should never invent actions.

---

# Conversation Flow

User Prompt

↓

Intent Detection

↓

Permission Check

↓

Tool Selection

↓

Business Service

↓

Response Generation

↓

Streaming Response

---

# Permission Rules

AI must reuse RBAC.

Examples

Employee

- Cannot allocate assets
- Cannot approve transfers

Department Head

- Can approve department requests

Administrator

- Full access

The AI should respond with authorization errors rather than bypassing permissions.

---

# Supported Queries

Search

- Find assets
- Find employees
- Find departments

Booking

- Check availability
- Reserve resources

Maintenance

- Report issue
- View work orders

Audit

- Show pending audits

Analytics

- Dashboard summary
- Asset utilization

Reports

- Generate reports

---

# Confirmation Workflow

High-impact actions require confirmation.

Examples

Allocate Asset

↓

"Are you sure?"

↓

Execute Tool

↓

Success Response

The AI should never execute destructive actions without confirmation.

---

# Backend Tasks

AI Gateway

Tool Registry

Tool Executor

Conversation Service

Streaming API

Permission Validator

Prompt Builder

---

# API Endpoints

```
POST /ai/chat

GET /ai/history

DELETE /ai/history
```

---

# Frontend Tasks

Pages

- AI Assistant

Components

- Chat Window
- Suggested Prompts
- Streaming Messages
- Tool Status
- Conversation History
- Typing Indicator

---

# Prompt Engineering

System prompt should include

- ERP Context
- Available Tools
- RBAC Rules
- Workflow Constraints
- Response Formatting

Never expose internal prompts.

---

# Business Rules

AI cannot bypass:

- Workflow Engine
- RBAC
- Validation
- Database Constraints
- Audit Logging

Every AI action must create an audit event.

---

# Validation Rules

Validate

- User Authentication
- User Permission
- Tool Exists
- Tool Parameters
- Confirmation Required

Reject

- Unknown Actions
- Unauthorized Actions
- Invalid Parameters

---

# Notifications

Notify users when AI performs

- Booking
- Maintenance Request
- Asset Allocation
- Report Generation

---

# Acceptance Criteria

AI answers questions accurately.

AI calls backend tools correctly.

RBAC enforced.

Streaming works.

Confirmation workflow implemented.

Conversation history stored.

Audit events generated.

No direct database access.

---

# Testing Checklist

Verify

- Asset Search
- Booking Creation
- Maintenance Request
- Dashboard Summary
- Unauthorized Requests
- Confirmation Flow
- Streaming Responses
- Tool Failures
- Conversation History
- Audit Events

---

# GitHub Issues

AI-001 AI Gateway

AI-002 LangChain Integration

AI-003 Tool Registry

AI-004 Tool Calling

AI-005 Chat UI

AI-006 Streaming Responses

AI-007 Conversation History

AI-008 RBAC Integration

AI-009 Prompt Engineering

AI-010 Testing

---

# Reusable Components Produced

AI Gateway

Tool Registry

Tool Executor

Conversation Manager

Streaming API

Prompt Builder

Permission-aware AI Layer

These components allow future AI capabilities to be added without modifying existing ERP modules.

---

# Definition of Success

The phase is complete when

✓ Users can interact with the ERP using natural language.

✓ AI successfully calls backend tools.

✓ All actions respect RBAC and workflows.

✓ AI never accesses the database directly.

✓ Responses stream in real time.

✓ Audit events are created for AI actions.

✓ The AI enhances productivity without compromising system integrity.

The project now demonstrates both enterprise software engineering and practical AI integration.

---

# Coding Agent Instructions

Read

- All project documentation
- All completed phase specifications

Implementation Rules

- Build AI as a thin orchestration layer over existing services.
- Use LangChain.js with tool calling only.
- Do not implement RAG or vector search.
- Never allow direct database access from AI.
- Enforce RBAC before every tool invocation.
- Require confirmation for high-impact actions.
- Generate audit events for every AI-triggered business operation.
- Keep AI modular so it can be disabled without affecting core ERP functionality.