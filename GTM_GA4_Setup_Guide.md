# GTM & GA4 Enhanced Contact Form Tracking Setup Guide

This guide provides step-by-step instructions for setting up comprehensive GA4 tracking for the ContactForm component using Google Tag Manager (GTM).

## Overview

The ContactForm component now includes enhanced data layer tracking for:
- Form views and interactions
- Field-level engagement
- Form submission attempts, successes, and errors
- Form abandonment
- Validation errors
- Performance metrics (timing)

## Data Layer Events

The following events are pushed to the data layer:

### 1. Form View Event
```javascript
{
  event: 'contact_form_view',
  form_location: 'page_name',
  page_url: 'current_url',
  timestamp: 'ISO_string'
}
```

### 2. Field Interaction Events
```javascript
{
  event: 'form_field_interaction',
  field_name: 'name|email|message',
  interaction_type: 'focus|blur|change',
  form_location: 'page_name',
  timestamp: 'ISO_string'
}
```

### 3. Form Submission Events

#### Submission Attempt
```javascript
{
  event: 'contact_form_submission_attempt',
  form_location: 'page_name',
  user_name: 'user_input',
  user_email: 'user_input',
  message_length: number,
  time_to_submit: number,
  timestamp: 'ISO_string'
}
```

#### Submission Success
```javascript
{
  event: 'contact_form_submission_success',
  form_location: 'page_name',
  user_name: 'user_input',
  user_email: 'user_input',
  message_length: number,
  submission_time: number,
  total_form_time: number,
  fields_interacted: number,
  timestamp: 'ISO_string',
  currency: 'USD',
  value: 1,
  event_category: 'engagement',
  event_label: 'page_name'
}
```

#### Submission Error
```javascript
{
  event: 'contact_form_submission_error',
  form_location: 'page_name',
  error_message: 'error_details',
  user_name: 'user_input',
  user_email: 'user_input',
  submission_time: number,
  total_form_time: number,
  timestamp: 'ISO_string',
  event_category: 'error',
  event_label: 'page_name'
}
```

### 4. Form Abandonment Event
```javascript
{
  event: 'contact_form_abandonment',
  form_location: 'page_name',
  time_on_form: number,
  fields_completed: number,
  timestamp: 'ISO_string'
}
```

### 5. Validation Error Event
```javascript
{
  event: 'contact_form_validation_error',
  form_location: 'page_name',
  validation_errors: [{
    field_name: 'field',
    error_messages: ['error1', 'error2']
  }],
  timestamp: 'ISO_string',
  event_category: 'form_validation',
  event_label: 'page_name'
}
```

## GTM Setup Instructions

### Step 1: Create Data Layer Variables

In GTM, create the following Data Layer Variables:

1. **DLV - Form Location**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `form_location`

2. **DLV - Field Name**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `field_name`

3. **DLV - Interaction Type**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `interaction_type`

4. **DLV - User Name**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `user_name`

5. **DLV - User Email**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `user_email`

6. **DLV - Message Length**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `message_length`

7. **DLV - Submission Time**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `submission_time`

8. **DLV - Total Form Time**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `total_form_time`

9. **DLV - Error Message**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `error_message`

10. **DLV - Event Category**
    - Variable Type: Data Layer Variable
    - Data Layer Variable Name: `event_category`

11. **DLV - Event Label**
    - Variable Type: Data Layer Variable
    - Data Layer Variable Name: `event_label`

### Step 2: Create Custom Event Triggers

Create the following Custom Event triggers:

1. **Trigger - Contact Form View**
   - Trigger Type: Custom Event
   - Event Name: `contact_form_view`

2. **Trigger - Form Field Interaction**
   - Trigger Type: Custom Event
   - Event Name: `form_field_interaction`

3. **Trigger - Contact Form Submission Attempt**
   - Trigger Type: Custom Event
   - Event Name: `contact_form_submission_attempt`

4. **Trigger - Contact Form Submission Success**
   - Trigger Type: Custom Event
   - Event Name: `contact_form_submission_success`

5. **Trigger - Contact Form Submission Error**
   - Trigger Type: Custom Event
   - Event Name: `contact_form_submission_error`

6. **Trigger - Contact Form Abandonment**
   - Trigger Type: Custom Event
   - Event Name: `contact_form_abandonment`

7. **Trigger - Contact Form Validation Error**
   - Trigger Type: Custom Event
   - Event Name: `contact_form_validation_error`

### Step 3: Create GA4 Event Tags

Create the following GA4 Event tags:

#### 1. GA4 - Contact Form View
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** {{GA4 Configuration Tag}}
- **Event Name:** `contact_form_view`
- **Event Parameters:**
  - `form_location`: {{DLV - Form Location}}
  - `page_location`: {{Page URL}}
- **Trigger:** Trigger - Contact Form View

#### 2. GA4 - Form Field Interaction
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** {{GA4 Configuration Tag}}
- **Event Name:** `form_field_interaction`
- **Event Parameters:**
  - `field_name`: {{DLV - Field Name}}
  - `interaction_type`: {{DLV - Interaction Type}}
  - `form_location`: {{DLV - Form Location}}
- **Trigger:** Trigger - Form Field Interaction

#### 3. GA4 - Contact Form Submission Success
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** {{GA4 Configuration Tag}}
- **Event Name:** `contact_form_submission`
- **Event Parameters:**
  - `form_location`: {{DLV - Form Location}}
  - `submission_time`: {{DLV - Submission Time}}
  - `total_form_time`: {{DLV - Total Form Time}}
  - `message_length`: {{DLV - Message Length}}
  - `event_category`: {{DLV - Event Category}}
  - `event_label`: {{DLV - Event Label}}
  - `value`: 1
  - `currency`: USD
- **Trigger:** Trigger - Contact Form Submission Success

#### 4. GA4 - Contact Form Error
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** {{GA4 Configuration Tag}}
- **Event Name:** `contact_form_error`
- **Event Parameters:**
  - `form_location`: {{DLV - Form Location}}
  - `error_message`: {{DLV - Error Message}}
  - `event_category`: {{DLV - Event Category}}
  - `event_label`: {{DLV - Event Label}}
- **Trigger:** Trigger - Contact Form Submission Error

#### 5. GA4 - Contact Form Abandonment
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** {{GA4 Configuration Tag}}
- **Event Name:** `contact_form_abandonment`
- **Event Parameters:**
  - `form_location`: {{DLV - Form Location}}
  - `time_on_form`: {{DLV - Total Form Time}}
- **Trigger:** Trigger - Contact Form Abandonment

#### 6. GA4 - Contact Form Validation Error
- **Tag Type:** Google Analytics: GA4 Event
- **Configuration Tag:** {{GA4 Configuration Tag}}
- **Event Name:** `contact_form_validation_error`
- **Event Parameters:**
  - `form_location`: {{DLV - Form Location}}
  - `event_category`: {{DLV - Event Category}}
  - `event_label`: {{DLV - Event Label}}
- **Trigger:** Trigger - Contact Form Validation Error

### Step 4: Alternative Form Submission Trigger (Optional)

If you prefer to use GTM's built-in Form Submission trigger:

1. **Create Form Submission Trigger:**
   - Trigger Type: Form Submission
   - Wait for Tags: True
   - Check Validation: True
   - Enable when: Form ID equals `contact-form`
   - OR Form CSS Selector equals `.gtm-contact-form`

2. **Create corresponding GA4 tag** with the same configuration as the custom event approach.

## Testing and Validation

### GTM Preview Mode
1. Enable GTM Preview mode
2. Navigate to pages with contact forms
3. Interact with form fields
4. Submit forms (both successful and error scenarios)
5. Verify all events fire correctly in GTM Preview

### GA4 DebugView
1. Enable GA4 DebugView
2. Test all form interactions
3. Verify events appear in real-time
4. Check event parameters are populated correctly

### Browser Developer Tools
1. Open browser console
2. Monitor `dataLayer` pushes: `console.log(window.dataLayer)`
3. Verify data structure matches expectations

## GA4 Analysis and Reporting

### Custom Events to Track
- **Contact Form Completion Rate:** `contact_form_submission_success` / `contact_form_view`
- **Form Abandonment Rate:** `contact_form_abandonment` / `contact_form_view`
- **Field Interaction Patterns:** Analyze `form_field_interaction` events
- **Form Performance:** Monitor `submission_time` and `total_form_time`
- **Error Analysis:** Track `contact_form_submission_error` and `contact_form_validation_error`

### Recommended GA4 Conversions
1. Set `contact_form_submission` as a conversion event
2. Create audiences based on form interactions
3. Set up custom reports for form performance analysis

### Enhanced Ecommerce Integration
The form submission includes `value` and `currency` parameters, allowing you to:
- Track form submissions as micro-conversions
- Include in ROI calculations
- Set up goal values for contact form completions

## Troubleshooting

### Common Issues
1. **Events not firing:** Check GTM Preview mode and browser console
2. **Missing parameters:** Verify Data Layer Variable names match exactly
3. **Duplicate events:** Ensure triggers don't overlap
4. **Performance impact:** Monitor page load times with tracking enabled

### Debug Commands
```javascript
// Check dataLayer contents
console.log(window.dataLayer);

// Monitor dataLayer pushes
window.dataLayer.push = function() {
  console.log('DataLayer push:', arguments);
  Array.prototype.push.apply(window.dataLayer, arguments);
};
```

## Security and Privacy Considerations

1. **PII Handling:** User names and emails are tracked - ensure compliance with privacy policies
2. **Data Retention:** Configure appropriate GA4 data retention settings
3. **Consent Management:** Integrate with your consent management platform
4. **GDPR Compliance:** Consider data minimization and user rights

## Performance Optimization

1. **Debounce field interactions** to reduce event volume
2. **Limit data layer payload size** for better performance
3. **Use GTM's built-in rate limiting** if needed
4. **Monitor Core Web Vitals** impact

This comprehensive setup provides detailed insights into contact form performance and user behavior while maintaining good performance and privacy practices.