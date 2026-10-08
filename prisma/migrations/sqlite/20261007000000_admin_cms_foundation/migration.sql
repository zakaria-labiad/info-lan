-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "passcode_hash" TEXT NOT NULL,
    "preferred_locale" TEXT NOT NULL DEFAULT 'FR',
    "must_reset_password" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "replaced_by_hash" TEXT,
    "expires_at" DATETIME NOT NULL,
    "revoked_at" DATETIME,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "used_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "login_throttles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key_hash" TEXT NOT NULL,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "blocked_until" DATETIME,
    "last_attempt_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "locale" TEXT NOT NULL DEFAULT 'FR',
    "source" TEXT NOT NULL DEFAULT 'contact',
    "ip_hash" TEXT,
    "assigned_to_id" INTEGER,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "read_at" DATETIME,
    "replied_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "contact_messages_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "contact_message_notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contact_message_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contact_message_notes_contact_message_id_fkey" FOREIGN KEY ("contact_message_id") REFERENCES "contact_messages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "contact_message_notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "contact_message_assignments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contact_message_id" INTEGER NOT NULL,
    "assigned_by_id" INTEGER NOT NULL,
    "assigned_to_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contact_message_assignments_contact_message_id_fkey" FOREIGN KEY ("contact_message_id") REFERENCES "contact_messages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "contact_message_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "contact_message_assignments_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contact_message_id" INTEGER,
    "sent_by_id" INTEGER,
    "idempotency_key" TEXT NOT NULL,
    "to_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body_html" TEXT NOT NULL,
    "body_text" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "provider_message_id" TEXT,
    "error_message" TEXT,
    "sent_at" DATETIME,
    "delivered_at" DATETIME,
    "failed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "email_logs_contact_message_id_fkey" FOREIGN KEY ("contact_message_id") REFERENCES "contact_messages" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "email_logs_sent_by_id_fkey" FOREIGN KEY ("sent_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "revision" INTEGER NOT NULL DEFAULT 1,
    "scheduled_at" DATETIME,
    "published_at" DATETIME,
    "created_by_id" INTEGER NOT NULL,
    "updated_by_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "blog_posts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "blog_posts_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "blog_post_translations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT,
    "content" JSONB NOT NULL,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "blog_post_translations_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug_fr" TEXT NOT NULL,
    "slug_en" TEXT NOT NULL,
    "description_fr" TEXT,
    "description_en" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug_fr" TEXT NOT NULL,
    "slug_en" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "blog_post_categories" (
    "post_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("post_id", "category_id"),
    CONSTRAINT "blog_post_categories_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "blog_post_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "blog_post_tags" (
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    PRIMARY KEY ("post_id", "tag_id"),
    CONSTRAINT "blog_post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "blog_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "blog_tags" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "blog_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_email" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ip_hash" TEXT,
    "moderated_by_id" INTEGER,
    "moderated_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "blog_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "blog_comments_moderated_by_id_fkey" FOREIGN KEY ("moderated_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "family" TEXT,
    "availability" TEXT,
    "is_best_seller" BOOLEAN NOT NULL DEFAULT false,
    "specifications" JSONB,
    "options" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "published_at" DATETIME,
    "created_by_id" INTEGER NOT NULL,
    "updated_by_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "products_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "products_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "product_translations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "product_translations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug_fr" TEXT NOT NULL,
    "slug_en" TEXT NOT NULL,
    "description_fr" TEXT,
    "description_en" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "product_category_assignments" (
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("product_id", "category_id"),
    CONSTRAINT "product_category_assignments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "product_category_assignments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "product_relations" (
    "source_product_id" INTEGER NOT NULL,
    "target_product_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("source_product_id", "target_product_id"),
    CONSTRAINT "product_relations_source_product_id_fkey" FOREIGN KEY ("source_product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "product_relations_target_product_id_fkey" FOREIGN KEY ("target_product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "original_url" TEXT,
    "file_name" TEXT NOT NULL,
    "file_size" BIGINT,
    "mime_type" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text_fr" TEXT,
    "alt_text_en" TEXT,
    "uploaded_by_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "media_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "blog_post_media" (
    "post_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("post_id", "media_id"),
    CONSTRAINT "blog_post_media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "blog_post_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "product_media" (
    "product_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("product_id", "media_id"),
    CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "product_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "company_name" TEXT NOT NULL,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "address_fr" TEXT,
    "address_en" TEXT,
    "map_latitude" REAL,
    "map_longitude" REAL,
    "public_site_url" TEXT,
    "email_from_name" TEXT,
    "email_from_address" TEXT,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "linkedin_url" TEXT,
    "youtube_url" TEXT,
    "seo_title_fr" TEXT,
    "seo_title_en" TEXT,
    "seo_description_fr" TEXT,
    "seo_description_en" TEXT,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "legal_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "revision" INTEGER NOT NULL DEFAULT 1,
    "published_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_is_active_idx" ON "users"("role", "is_active");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_revoked_at_idx" ON "refresh_tokens"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "login_throttles_key_hash_key" ON "login_throttles"("key_hash");

-- CreateIndex
CREATE INDEX "login_throttles_blocked_until_idx" ON "login_throttles"("blocked_until");

-- CreateIndex
CREATE INDEX "contact_messages_status_created_at_idx" ON "contact_messages"("status", "created_at");

-- CreateIndex
CREATE INDEX "contact_messages_email_idx" ON "contact_messages"("email");

-- CreateIndex
CREATE INDEX "contact_messages_assigned_to_id_status_idx" ON "contact_messages"("assigned_to_id", "status");

-- CreateIndex
CREATE INDEX "contact_messages_ip_hash_created_at_idx" ON "contact_messages"("ip_hash", "created_at");

-- CreateIndex
CREATE INDEX "contact_messages_deleted_at_idx" ON "contact_messages"("deleted_at");

-- CreateIndex
CREATE INDEX "contact_message_notes_contact_message_id_created_at_idx" ON "contact_message_notes"("contact_message_id", "created_at");

-- CreateIndex
CREATE INDEX "contact_message_notes_author_id_idx" ON "contact_message_notes"("author_id");

-- CreateIndex
CREATE INDEX "contact_message_assignments_contact_message_id_created_at_idx" ON "contact_message_assignments"("contact_message_id", "created_at");

-- CreateIndex
CREATE INDEX "contact_message_assignments_assigned_by_id_idx" ON "contact_message_assignments"("assigned_by_id");

-- CreateIndex
CREATE INDEX "contact_message_assignments_assigned_to_id_idx" ON "contact_message_assignments"("assigned_to_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_logs_idempotency_key_key" ON "email_logs"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "email_logs_provider_message_id_key" ON "email_logs"("provider_message_id");

-- CreateIndex
CREATE INDEX "email_logs_contact_message_id_created_at_idx" ON "email_logs"("contact_message_id", "created_at");

-- CreateIndex
CREATE INDEX "email_logs_sent_by_id_idx" ON "email_logs"("sent_by_id");

-- CreateIndex
CREATE INDEX "email_logs_status_idx" ON "email_logs"("status");

-- CreateIndex
CREATE INDEX "blog_posts_status_published_at_idx" ON "blog_posts"("status", "published_at");

-- CreateIndex
CREATE INDEX "blog_posts_scheduled_at_idx" ON "blog_posts"("scheduled_at");

-- CreateIndex
CREATE INDEX "blog_posts_created_by_id_idx" ON "blog_posts"("created_by_id");

-- CreateIndex
CREATE INDEX "blog_posts_deleted_at_idx" ON "blog_posts"("deleted_at");

-- CreateIndex
CREATE INDEX "blog_post_translations_locale_is_ready_idx" ON "blog_post_translations"("locale", "is_ready");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_translations_post_id_locale_key" ON "blog_post_translations"("post_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_translations_locale_slug_key" ON "blog_post_translations"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_fr_key" ON "blog_categories"("slug_fr");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_en_key" ON "blog_categories"("slug_en");

-- CreateIndex
CREATE INDEX "blog_categories_sort_order_idx" ON "blog_categories"("sort_order");

-- CreateIndex
CREATE INDEX "blog_categories_is_active_deleted_at_idx" ON "blog_categories"("is_active", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_fr_key" ON "blog_tags"("slug_fr");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_en_key" ON "blog_tags"("slug_en");

-- CreateIndex
CREATE INDEX "blog_tags_deleted_at_idx" ON "blog_tags"("deleted_at");

-- CreateIndex
CREATE INDEX "blog_post_categories_category_id_sort_order_idx" ON "blog_post_categories"("category_id", "sort_order");

-- CreateIndex
CREATE INDEX "blog_post_tags_tag_id_idx" ON "blog_post_tags"("tag_id");

-- CreateIndex
CREATE INDEX "blog_comments_post_id_status_created_at_idx" ON "blog_comments"("post_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "blog_comments_status_created_at_idx" ON "blog_comments"("status", "created_at");

-- CreateIndex
CREATE INDEX "blog_comments_ip_hash_created_at_idx" ON "blog_comments"("ip_hash", "created_at");

-- CreateIndex
CREATE INDEX "products_status_sort_order_idx" ON "products"("status", "sort_order");

-- CreateIndex
CREATE INDEX "products_family_idx" ON "products"("family");

-- CreateIndex
CREATE INDEX "products_is_best_seller_idx" ON "products"("is_best_seller");

-- CreateIndex
CREATE INDEX "products_deleted_at_idx" ON "products"("deleted_at");

-- CreateIndex
CREATE INDEX "product_translations_locale_is_ready_idx" ON "product_translations"("locale", "is_ready");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_product_id_locale_key" ON "product_translations"("product_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_locale_slug_key" ON "product_translations"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_fr_key" ON "product_categories"("slug_fr");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_en_key" ON "product_categories"("slug_en");

-- CreateIndex
CREATE INDEX "product_categories_sort_order_idx" ON "product_categories"("sort_order");

-- CreateIndex
CREATE INDEX "product_categories_is_active_deleted_at_idx" ON "product_categories"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "product_category_assignments_category_id_sort_order_idx" ON "product_category_assignments"("category_id", "sort_order");

-- CreateIndex
CREATE INDEX "product_relations_target_product_id_idx" ON "product_relations"("target_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_public_id_key" ON "media"("public_id");

-- CreateIndex
CREATE INDEX "media_mime_type_idx" ON "media"("mime_type");

-- CreateIndex
CREATE INDEX "media_uploaded_by_id_idx" ON "media"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "media_deleted_at_idx" ON "media"("deleted_at");

-- CreateIndex
CREATE INDEX "blog_post_media_media_id_idx" ON "blog_post_media"("media_id");

-- CreateIndex
CREATE INDEX "blog_post_media_post_id_is_cover_idx" ON "blog_post_media"("post_id", "is_cover");

-- CreateIndex
CREATE INDEX "product_media_media_id_idx" ON "product_media"("media_id");

-- CreateIndex
CREATE INDEX "product_media_product_id_is_primary_idx" ON "product_media"("product_id", "is_primary");

-- CreateIndex
CREATE INDEX "legal_documents_status_published_at_idx" ON "legal_documents"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "legal_documents_type_locale_key" ON "legal_documents"("type", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "legal_documents_locale_slug_key" ON "legal_documents"("locale", "slug");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");
