CREATE TABLE "custom_agents" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"api_endpoint" text NOT NULL,
	"api_key" text,
	"default_model" text,
	"icon" text,
	"config_options" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generated_images" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text,
	"prompt" text NOT NULL,
	"image_url" text NOT NULL,
	"model" text,
	"provider" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
