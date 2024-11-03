export function toPascalCase(name:string) {
    return name
      .toLowerCase()
      .split('  ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
  

  