

## Fix: Update Payment Info to Use Edge Function

### Problem Identified

The `updatePaymentInfo` function in `src/hooks/calculator/utils/submission-db.ts` (lines 186-211) still uses direct Supabase database update:

```typescript
const { error } = await supabase
  .from('cost_calculator_submissions')
  .update(updateData)
  .eq('id', submissionId);
```

This will fail because the RLS policy `Admins can update submissions` only allows admin users to update records. Anonymous users cannot update their own submissions directly.

### Solution

Modify `updatePaymentInfo` to use the same edge function approach as `updateSubmission`, which already works correctly.

### Changes Required

**File: `src/hooks/calculator/utils/submission-db.ts`**

**Lines 186-211** - Update the `updatePaymentInfo` function to invoke the edge function instead of direct database access:

```typescript
export const updatePaymentInfo = async (
  submissionId: string,
  updateData: Record<string, any>
) => {
  return withRetry(async () => {
    // Ensure we never save a zero or negative price to the database
    if (updateData.total_price !== undefined && updateData.total_price <= 0) {
      console.warn('Prevented saving zero or negative price in payment info');
      delete updateData.total_price;
    }
    
    console.log('Updating payment info via edge function:', submissionId, 'with data:', updateData);

    const { data, error } = await supabase.functions.invoke('update-submission', {
      body: { id: submissionId, update: updateData }
    });

    if (error) {
      throw handleDatabaseError(error, 'update payment info');
    }

    console.log('Updated payment info successfully via edge function');
    return { error: null };
  });
};
```

### Why This Fixes the Issue

1. The edge function uses the service role key which bypasses RLS
2. Both `updateSubmission` and `updatePaymentInfo` will use the same secure path
3. The edge function already handles all the fields that payment info needs (`preferred_installation_date`, `checkout_session_id`, `payment_status`, `total_price`)

### Technical Details

The edge function `update-submission` already supports all payment-related fields in its allowed fields list:
- `preferred_installation_date`
- `checkout_session_id`  
- `payment_status`
- `total_price`

No changes are needed to the edge function itself.

