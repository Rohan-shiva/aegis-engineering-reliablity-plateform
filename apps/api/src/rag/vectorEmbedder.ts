export class VectorEmbedder {
  public static generateEmbedding(text: string, dimensions = 1536): number[] {
    const vector: number[] = new Array(dimensions);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    let norm = 0;
    for (let d = 0; d < dimensions; d++) {
      const val = Math.sin(hash + d * 0.1) * Math.cos(d * 0.05);
      vector[d] = val;
      norm += val * val;
    }

    // Normalize vector to unit length
    const sqrtNorm = Math.sqrt(norm) || 1;
    for (let d = 0; d < dimensions; d++) {
      vector[d] /= sqrtNorm;
    }

    return vector;
  }
}
