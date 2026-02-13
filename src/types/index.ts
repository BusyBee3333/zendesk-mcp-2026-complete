// Zendesk API Types
// Based on Zendesk API v2 Documentation

export interface ZendeskConfig {
  subdomain: string;
  email?: string;
  apiToken?: string;
  oauthToken?: string;
}

export interface ZendeskError {
  error: string;
  description: string;
}

export interface PaginationMeta {
  has_more: boolean;
  after_cursor?: string;
  before_cursor?: string;
  after_url?: string;
  before_url?: string;
}

// Ticket Types
export interface Ticket {
  id: number;
  url: string;
  external_id?: string;
  type?: 'problem' | 'incident' | 'question' | 'task';
  subject?: string;
  raw_subject?: string;
  description?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  status: 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed';
  recipient?: string;
  requester_id: number;
  submitter_id: number;
  assignee_id?: number;
  organization_id?: number;
  group_id?: number;
  collaborator_ids?: number[];
  follower_ids?: number[];
  email_cc_ids?: number[];
  forum_topic_id?: number;
  problem_id?: number;
  has_incidents: boolean;
  is_public: boolean;
  due_at?: string;
  tags: string[];
  custom_fields?: CustomFieldValue[];
  satisfaction_rating?: SatisfactionRating;
  sharing_agreement_ids?: number[];
  fields?: CustomFieldValue[];
  followup_ids?: number[];
  ticket_form_id?: number;
  brand_id?: number;
  allow_channelback: boolean;
  allow_attachments: boolean;
  via: Via;
  custom_status_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TicketComment {
  id: number;
  type: 'Comment' | 'VoiceComment';
  author_id: number;
  body: string;
  html_body: string;
  plain_body: string;
  public: boolean;
  attachments?: Attachment[];
  audit_id: number;
  via: Via;
  metadata?: {
    system?: Record<string, any>;
    custom?: Record<string, any>;
  };
  created_at: string;
}

export interface Attachment {
  id: number;
  file_name: string;
  content_url: string;
  content_type: string;
  size: number;
  width?: number;
  height?: number;
  inline: boolean;
  deleted: boolean;
  malware_access_override: boolean;
  malware_scan_result?: string;
  thumbnails?: Thumbnail[];
}

export interface Thumbnail {
  id: number;
  file_name: string;
  content_url: string;
  content_type: string;
  size: number;
  width: number;
  height: number;
}

export interface Via {
  channel: string;
  source?: {
    from?: any;
    to?: any;
    rel?: string;
  };
}

export interface CustomFieldValue {
  id: number;
  value: any;
}

// User Types
export interface User {
  id: number;
  url: string;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
  time_zone?: string;
  iana_time_zone?: string;
  phone?: string;
  shared_phone_number?: boolean;
  photo?: Attachment;
  locale_id?: number;
  locale?: string;
  organization_id?: number;
  role: 'end-user' | 'agent' | 'admin';
  verified: boolean;
  external_id?: string;
  tags: string[];
  alias?: string;
  active: boolean;
  shared: boolean;
  shared_agent: boolean;
  last_login_at?: string;
  two_factor_auth_enabled?: boolean;
  signature?: string;
  details?: string;
  notes?: string;
  role_type?: number;
  custom_role_id?: number;
  moderator: boolean;
  ticket_restriction?: 'organization' | 'groups' | 'assigned' | 'requested' | null;
  only_private_comments: boolean;
  restricted_agent: boolean;
  suspended: boolean;
  default_group_id?: number;
  report_csv: boolean;
  user_fields?: Record<string, any>;
}

export interface UserIdentity {
  id: number;
  url: string;
  user_id: number;
  type: 'email' | 'twitter' | 'facebook' | 'google' | 'phone_number' | 'agent_forwarding' | 'sdk';
  value: string;
  verified: boolean;
  primary: boolean;
  created_at: string;
  updated_at: string;
  undeliverable_count?: number;
  deliverable_state?: string;
}

// Organization Types
export interface Organization {
  id: number;
  url: string;
  external_id?: string;
  name: string;
  created_at: string;
  updated_at: string;
  domain_names: string[];
  details?: string;
  notes?: string;
  group_id?: number;
  shared_tickets: boolean;
  shared_comments: boolean;
  tags: string[];
  organization_fields?: Record<string, any>;
}

export interface OrganizationMembership {
  id: number;
  url: string;
  user_id: number;
  organization_id: number;
  default: boolean;
  created_at: string;
  updated_at: string;
}

// Group Types
export interface Group {
  id: number;
  url: string;
  name: string;
  description?: string;
  default: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMembership {
  id: number;
  url: string;
  user_id: number;
  group_id: number;
  default: boolean;
  created_at: string;
  updated_at: string;
}

// View Types
export interface View {
  id: number;
  title: string;
  active: boolean;
  position: number;
  description?: string;
  conditions: ViewConditions;
  execution: ViewExecution;
  restriction?: ViewRestriction;
  raw_title?: string;
  created_at: string;
  updated_at: string;
}

export interface ViewConditions {
  all: ViewCondition[];
  any?: ViewCondition[];
}

export interface ViewCondition {
  field: string;
  operator: string;
  value: string | number | string[];
}

export interface ViewExecution {
  group_by?: string;
  group_order?: 'asc' | 'desc';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  group?: {
    id: string;
    title: string;
    order: string;
  };
  sort?: {
    id: string;
    title: string;
    order: string;
  };
  columns?: ViewColumn[];
  fields?: ViewColumn[];
  custom_fields?: number[];
}

export interface ViewColumn {
  id: string;
  title?: string;
  type?: string;
}

export interface ViewRestriction {
  type: 'Group' | 'User';
  id?: number;
  ids?: number[];
}

export interface ViewCount {
  view_id: number;
  url: string;
  value: number;
  pretty: string;
  fresh: boolean;
}

// Macro Types
export interface Macro {
  id: number;
  title: string;
  active: boolean;
  position: number;
  description?: string;
  actions: MacroAction[];
  restriction?: {
    type: 'Group' | 'User';
    id?: number;
    ids?: number[];
  };
  raw_title?: string;
  created_at: string;
  updated_at: string;
}

export interface MacroAction {
  field: string;
  value: any;
}

export interface MacroApplication {
  result: {
    ticket: Partial<Ticket>;
    comment?: Partial<TicketComment>;
  };
}

// Trigger Types
export interface Trigger {
  id: number;
  title: string;
  active: boolean;
  position: number;
  description?: string;
  conditions: TriggerConditions;
  actions: TriggerAction[];
  raw_title?: string;
  created_at: string;
  updated_at: string;
  category_id?: string;
}

export interface TriggerConditions {
  all: TriggerCondition[];
  any?: TriggerCondition[];
}

export interface TriggerCondition {
  field: string;
  operator: string;
  value: string | number | string[];
}

export interface TriggerAction {
  field: string;
  value: any;
}

// Automation Types
export interface Automation {
  id: number;
  title: string;
  active: boolean;
  position: number;
  conditions: AutomationConditions;
  actions: AutomationAction[];
  raw_title?: string;
  created_at: string;
  updated_at: string;
}

export interface AutomationConditions {
  all: AutomationCondition[];
  any?: AutomationCondition[];
}

export interface AutomationCondition {
  field: string;
  operator: string;
  value: string | number | string[];
}

export interface AutomationAction {
  field: string;
  value: any;
}

// SLA Policy Types
export interface SLAPolicy {
  id: number;
  title: string;
  description?: string;
  position: number;
  filter: {
    all: SLAPolicyCondition[];
    any?: SLAPolicyCondition[];
  };
  policy_metrics: SLAPolicyMetric[];
  created_at: string;
  updated_at: string;
}

export interface SLAPolicyCondition {
  field: string;
  operator: string;
  value: string | number | string[];
}

export interface SLAPolicyMetric {
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metric: 'first_reply_time' | 'next_reply_time' | 'requester_wait_time' | 'agent_work_time';
  target: number;
  business_hours: boolean;
}

// Brand Types
export interface Brand {
  id: number;
  url: string;
  name: string;
  brand_url?: string;
  has_help_center: boolean;
  help_center_state: 'enabled' | 'disabled' | 'restricted';
  active: boolean;
  default: boolean;
  logo?: Attachment;
  ticket_form_ids?: number[];
  signature_template?: string;
  created_at: string;
  updated_at: string;
  subdomain: string;
  host_mapping?: string;
}

// Satisfaction Rating Types
export interface SatisfactionRating {
  id: number;
  url: string;
  assignee_id: number;
  group_id?: number;
  requester_id: number;
  ticket_id: number;
  score: 'offered' | 'unoffered' | 'good' | 'bad';
  comment?: string;
  reason?: string;
  reason_id?: number;
  created_at: string;
  updated_at: string;
}

// Suspended Ticket Types
export interface SuspendedTicket {
  id: number;
  subject?: string;
  recipient: string;
  via: Via;
  author: {
    id?: number;
    email?: string;
    name?: string;
  };
  cause?: string;
  error_messages?: string[];
  content: string;
  message_id?: string;
  ticket_id?: number;
  brand_id: number;
  created_at: string;
  updated_at: string;
}

// Ticket Field Types
export interface TicketField {
  id: number;
  url: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date' | 'integer' | 'decimal' | 'regexp' | 'partialcreditcard' | 'multiselect' | 'tagger' | 'lookup';
  title: string;
  raw_title?: string;
  description?: string;
  raw_description?: string;
  position: number;
  active: boolean;
  required: boolean;
  collapsed_for_agents: boolean;
  regexp_for_validation?: string;
  title_in_portal?: string;
  raw_title_in_portal?: string;
  visible_in_portal: boolean;
  editable_in_portal: boolean;
  required_in_portal: boolean;
  tag?: string;
  created_at: string;
  updated_at: string;
  removable: boolean;
  agent_description?: string;
  custom_field_options?: CustomFieldOption[];
  sub_type_id?: number;
  system_field_options?: SystemFieldOption[];
  relationship_filter?: any;
  relationship_target_type?: string;
}

export interface CustomFieldOption {
  id: number;
  name: string;
  raw_name?: string;
  value: string;
  default?: boolean;
}

export interface SystemFieldOption {
  name: string;
  value: string;
}

export interface UserField {
  id: number;
  url: string;
  key: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date' | 'integer' | 'decimal' | 'regexp' | 'dropdown' | 'lookup';
  title: string;
  raw_title?: string;
  description?: string;
  raw_description?: string;
  position: number;
  active: boolean;
  system: boolean;
  regexp_for_validation?: string;
  tag?: string;
  custom_field_options?: CustomFieldOption[];
  created_at: string;
  updated_at: string;
}

export interface OrganizationField {
  id: number;
  url: string;
  key: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date' | 'integer' | 'decimal' | 'regexp' | 'dropdown' | 'lookup';
  title: string;
  raw_title?: string;
  description?: string;
  raw_description?: string;
  position: number;
  active: boolean;
  system: boolean;
  regexp_for_validation?: string;
  tag?: string;
  custom_field_options?: CustomFieldOption[];
  created_at: string;
  updated_at: string;
}

// Search Types
export interface SearchResult<T> {
  results: T[];
  count: number;
  next_page?: string;
  previous_page?: string;
  facets?: string;
}

// Ticket Form Types
export interface TicketForm {
  id: number;
  url: string;
  name: string;
  raw_name?: string;
  display_name?: string;
  raw_display_name?: string;
  position: number;
  active: boolean;
  default: boolean;
  end_user_visible: boolean;
  ticket_field_ids: number[];
  in_all_brands: boolean;
  restricted_brand_ids?: number[];
  agent_conditions?: any[];
  end_user_conditions?: any[];
  created_at: string;
  updated_at: string;
}

// API Response Wrappers
export interface SingleResourceResponse<T> {
  [key: string]: T;
}

export interface MultiResourceResponse<T> {
  [key: string]: T[] | PaginationMeta | { prev?: string; next?: string } | number | undefined;
  meta?: PaginationMeta;
  links?: {
    prev?: string;
    next?: string;
  };
  count?: number;
}

export interface JobStatus {
  id: string;
  url: string;
  total: number;
  progress: number;
  status: 'queued' | 'working' | 'failed' | 'completed' | 'killed';
  message?: string;
  results?: any[];
}
