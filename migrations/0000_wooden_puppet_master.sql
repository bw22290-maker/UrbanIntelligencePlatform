CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"action" varchar NOT NULL,
	"entity_type" varchar NOT NULL,
	"entity_id" integer,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "environmental_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" varchar NOT NULL,
	"value" numeric(10, 3) NOT NULL,
	"unit" varchar NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"project_id" integer,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "land_use_zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"zone_type" varchar NOT NULL,
	"coordinates" jsonb,
	"efficiency" numeric(5, 2) DEFAULT '0.00',
	"project_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'active',
	"progress" integer DEFAULT 0,
	"user_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traffic_nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"node_type" varchar NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"flow_rate" integer DEFAULT 0,
	"efficiency" numeric(5, 2) DEFAULT '0.00',
	"project_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'planner',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environmental_metrics" ADD CONSTRAINT "environmental_metrics_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "land_use_zones" ADD CONSTRAINT "land_use_zones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traffic_nodes" ADD CONSTRAINT "traffic_nodes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");