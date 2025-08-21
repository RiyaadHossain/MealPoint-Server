export enum PaymentStatus {
  PENDING = "pending",       // Payment initiated but not completed
  SUCCESS = "success",       // Payment successfully completed
  FAILED = "failed",         // Payment attempt failed
  CANCELLED = "cancelled"    // Payment was cancelled by user or system
}
