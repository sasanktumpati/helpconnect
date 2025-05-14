CREATE OR REPLACE FUNCTION get_donation_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_donations', COUNT(*),
    'total_amount', COALESCE(SUM(amount), 0),
    'avg_donation', COALESCE(AVG(amount), 0),
    'donation_count_by_month', (
      SELECT json_agg(
        json_build_object(
          'month', TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM'),
          'count', COUNT(*),
          'amount', COALESCE(SUM(amount), 0)
        )
      )
      FROM donations
      WHERE payment_status = 'completed'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) DESC
      LIMIT 12
    )
  )
  INTO result
  FROM donations
  WHERE payment_status = 'completed';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_organization_donation_stats(org_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_donations', COUNT(*),
    'total_amount', COALESCE(SUM(d.amount), 0),
    'avg_donation', COALESCE(AVG(d.amount), 0),
    'donation_count_by_month', (
      SELECT json_agg(
        json_build_object(
          'month', TO_CHAR(DATE_TRUNC('month', d.created_at), 'YYYY-MM'),
          'count', COUNT(*),
          'amount', COALESCE(SUM(d.amount), 0)
        )
      )
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE c.creator_id = org_id
      AND d.payment_status = 'completed'
      GROUP BY DATE_TRUNC('month', d.created_at)
      ORDER BY DATE_TRUNC('month', d.created_at) DESC
      LIMIT 12
    )
  )
  INTO result
  FROM donations d
  JOIN campaigns c ON d.campaign_id = c.id
  WHERE c.creator_id = org_id
  AND d.payment_status = 'completed';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
