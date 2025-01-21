import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  // List of keys to ignore during serialization
  private readonly ignoredKeys = new Set([
    'dbService',
    'configService',
    '_client',
    '_originalClient',
    'connection',
    // Add any other keys you want to ignore
  ]);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (data === undefined || data === null) {
          return null; // Return null for undefined/null data
        }
        
        const serialized = JSON.stringify(data, this.getCircularReplacer());
        // Only parse if we have a valid JSON string
        return serialized === undefined ? null : JSON.parse(serialized);
      }),
    );
  }

  private getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      // First check if this is a key we want to ignore
      if (this.ignoredKeys.has(key)) {
        return undefined; // This will remove the key from the output
      }

      // Handle null/undefined values
      if (value === undefined) {
        return null; // Convert undefined to null for valid JSON
      }

      // Then handle circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return null; // Convert circular references to null
        }
        seen.add(value);
      }
      return value;
    };
  }
}