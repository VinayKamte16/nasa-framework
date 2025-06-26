#!/usr/bin/env python3
import sys

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('No image URL provided', file=sys.stderr)
        sys.exit(1)
    image_url = sys.argv[1]
    # Simulate enhancement by appending a query param
    enhanced_url = image_url + ('&' if '?' in image_url else '?') + 'enhanced=1'
    print(enhanced_url) 