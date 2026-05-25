// ============================================================
// LINHA RETA TURISMO — Database Types
// Gerado manualmente. Para regenerar com Supabase CLI:
// npm run db:types
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      destinations: {
        Row: {
          id: string
          slug: string
          name: string
          short_description: string | null
          long_description: string | null
          category: 'nordeste' | 'nacional' | 'internacional' | 'cruzeiro'
          cover_image_url: string | null
          gallery_urls: string[]
          base_price: number | null
          promotion_price: number | null
          promotion_end_date: string | null
          duration_days: number | null
          includes: string[]
          not_includes: string[]
          highlights: string[]
          whatsapp_message: string | null
          status: 'active' | 'inactive' | 'promotion'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: Json | null
          cover_image_url: string | null
          category: string | null
          tags: string[]
          meta_title: string | null
          meta_description: string | null
          og_image_url: string | null
          status: 'draft' | 'published' | 'archived'
          reading_time_min: number | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string | null
          destination_id: string | null
          source: 'contact_form' | 'destination_page' | 'blog' | 'capture_page'
          status: 'new' | 'contacted' | 'converted' | 'lost'
          admin_notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Pick<Database['public']['Tables']['leads']['Row'], 'status' | 'admin_notes'>>
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          is_subscribed: boolean
          unsubscribe_token: string
          source: 'capture_page' | 'contact_form' | 'blog' | 'manual'
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'id' | 'subscribed_at' | 'unsubscribe_token'>
        Update: Partial<Pick<Database['public']['Tables']['subscribers']['Row'], 'is_subscribed' | 'unsubscribed_at' | 'name'>>
      }
      email_campaigns: {
        Row: {
          id: string
          name: string
          subject: string
          preview_text: string | null
          blocks: Json
          html_content: string | null
          status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
          scheduled_at: string | null
          sent_at: string | null
          recipient_count: number
          open_count: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['email_campaigns']['Insert']>
      }
      promotions: {
        Row: {
          id: string
          title: string
          description: string | null
          destination_id: string | null
          discount_type: 'percentage' | 'fixed'
          original_price: number | null
          promotional_price: number | null
          badge_text: string
          is_active: boolean
          start_date: string
          end_date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['promotions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['promotions']['Insert']>
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          destination_visited: string | null
          rating: number
          content: string
          photo_url: string | null
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
      }
    }
  }
}

// ---- Conveniência ----
export type Destination  = Database['public']['Tables']['destinations']['Row']
export type Post         = Database['public']['Tables']['posts']['Row']
export type Lead         = Database['public']['Tables']['leads']['Row']
export type Subscriber   = Database['public']['Tables']['subscribers']['Row']
export type Campaign     = Database['public']['Tables']['email_campaigns']['Row']
export type Promotion    = Database['public']['Tables']['promotions']['Row']
export type Testimonial  = Database['public']['Tables']['testimonials']['Row']
