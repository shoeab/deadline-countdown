/**
 * Represents a hardware camera with specific operational ranges
 */
interface HardwareCamera {
  id: string; // Unique identifier for the camera
  minDistance: number; // Minimum subject distance (in some unit)
  maxDistance: number; // Maximum subject distance (in some unit)
  minLightLevel: number; // Minimum light level (in some unit)
  maxLightLevel: number; // Maximum light level (in some unit)
}

/**
 * Represents the desired operational range for the software camera
 */
interface SoftwareCameraRequirements {
  minDistance: number;
  maxDistance: number;
  minLightLevel: number;
  maxLightLevel: number;
}

/**
 * Checks if a set of hardware cameras can fulfill the requirements of the software camera
 *
 * @param requirements - The desired operational ranges for the software camera
 * @param hardwareCameras - Array of available hardware cameras to choose from
 * @returns Whether the hardware cameras can cover the entire required range
 */
function canCoverRequirements(
  requirements: SoftwareCameraRequirements,
  hardwareCameras: HardwareCamera[]
): boolean {
  // First, we'll check if we can cover the entire distance range at each light level
  // We'll do this by creating "range segments" that our cameras can cover

  // Filter out cameras that operate outside our required light range entirely
  const relevantCameras = hardwareCameras.filter(
    (camera) =>
      !(
        camera.maxLightLevel < requirements.minLightLevel ||
        camera.minLightLevel > requirements.maxLightLevel
      )
  );

  if (relevantCameras.length === 0) {
    return false; // No cameras work within our light range
  }

  // For each relevant camera, we need to check what distance ranges they cover
  // at different light levels across our required light range

  // We'll divide our required light range into segments where different
  // sets of cameras are active
  const lightBoundaries = new Set<number>();
  lightBoundaries.add(requirements.minLightLevel);
  lightBoundaries.add(requirements.maxLightLevel);

  relevantCameras.forEach((camera) => {
    // Only add boundaries that fall within our requirements
    if (
      camera.minLightLevel > requirements.minLightLevel &&
      camera.minLightLevel < requirements.maxLightLevel
    ) {
      lightBoundaries.add(camera.minLightLevel);
    }
    if (
      camera.maxLightLevel > requirements.minLightLevel &&
      camera.maxLightLevel < requirements.maxLightLevel
    ) {
      lightBoundaries.add(camera.maxLightLevel);
    }
  });

  // Convert to array and sort
  const sortedLightBoundaries = Array.from(lightBoundaries).sort(
    (a, b) => a - b
  );

  // Check each light level range
  for (let i = 0; i < sortedLightBoundaries.length - 1; i++) {
    const lowerLight = sortedLightBoundaries[i];
    const upperLight = sortedLightBoundaries[i + 1];
    const midpointLight = (lowerLight + upperLight) / 2;

    // Find cameras that work at this light level
    const camerasForLightLevel = relevantCameras.filter(
      (camera) =>
        camera.minLightLevel <= midpointLight &&
        camera.maxLightLevel >= midpointLight
    );

    // Check if these cameras cover the entire distance range
    if (
      !canCoverDistanceRange(
        requirements.minDistance,
        requirements.maxDistance,
        camerasForLightLevel
      )
    ) {
      return false; // Gap in coverage at this light level
    }
  }

  return true;
}

/**
 * Helper function to check if a set of cameras can cover a distance range
 *
 * @param minDistance - Minimum distance to cover
 * @param maxDistance - Maximum distance to cover
 * @param cameras - Available cameras for this check
 * @returns Whether the cameras can cover the entire distance range
 */
function canCoverDistanceRange(
  minDistance: number,
  maxDistance: number,
  cameras: HardwareCamera[]
): boolean {
  // Sort cameras by their minimum distance
  const sortedCameras = [...cameras].sort(
    (a, b) => a.minDistance - b.minDistance
  );

  let coveredUpTo = minDistance;

  for (const camera of sortedCameras) {
    // If there's a gap in coverage, return false
    if (camera.minDistance > coveredUpTo) {
      return false;
    }

    // Extend coverage if this camera covers farther
    if (camera.maxDistance > coveredUpTo) {
      coveredUpTo = camera.maxDistance;
    }

    // If we've covered the entire range, we're done
    if (coveredUpTo >= maxDistance) {
      return true;
    }
  }

  // If we've gone through all cameras but haven't covered the range
  return false;
}

// Example 1: Testing a simple case with two cameras
const basicRequirements: SoftwareCameraRequirements = {
  minDistance: 1, // 1 meter
  maxDistance: 10, // 10 meters
  minLightLevel: 10, // 10 lux
  maxLightLevel: 1000, // 1000 lux
};

const basicCameras: HardwareCamera[] = [
  {
    id: "cam1",
    minDistance: 1,
    maxDistance: 5,
    minLightLevel: 10,
    maxLightLevel: 1000,
  },
  {
    id: "cam2",
    minDistance: 4, // Note the overlap with cam1
    maxDistance: 10,
    minLightLevel: 10,
    maxLightLevel: 1000,
  },
];

console.log(
  "Basic example:",
  canCoverRequirements(basicRequirements, basicCameras)
);
// Output: true - The cameras fully cover the required ranges

// Example 2: Testing a case with a gap in distance coverage
const gapCameras: HardwareCamera[] = [
  {
    id: "cam1",
    minDistance: 1,
    maxDistance: 4,
    minLightLevel: 10,
    maxLightLevel: 1000,
  },
  {
    id: "cam2",
    minDistance: 6, // Gap between 4-6 meters
    maxDistance: 10,
    minLightLevel: 10,
    maxLightLevel: 1000,
  },
];

console.log(
  "Gap example:",
  canCoverRequirements(basicRequirements, gapCameras)
);
// Output: false - There's a gap in distance coverage

// Example 3: Testing a case with different light level ranges
const advancedRequirements: SoftwareCameraRequirements = {
  minDistance: 1,
  maxDistance: 15,
  minLightLevel: 5,
  maxLightLevel: 2000,
};

const advancedCameras: HardwareCamera[] = [
  {
    id: "lowLightCam",
    minDistance: 1,
    maxDistance: 8,
    minLightLevel: 5,
    maxLightLevel: 500,
  },
  {
    id: "midRangeCam",
    minDistance: 3,
    maxDistance: 12,
    minLightLevel: 100,
    maxLightLevel: 1500,
  },
  {
    id: "brightLightCam",
    minDistance: 5,
    maxDistance: 15,
    minLightLevel: 800,
    maxLightLevel: 2000,
  },
];

console.log(
  "Advanced example:",
  canCoverRequirements(advancedRequirements, advancedCameras)
);
// Output depends on whether these cameras collectively cover all combinations

// Example 4: Real-world scenario with many cameras
const professionalRequirements: SoftwareCameraRequirements = {
  minDistance: 0.1, // 10cm
  maxDistance: 100, // 100 meters
  minLightLevel: 1, // Very low light
  maxLightLevel: 10000, // Very bright
};

const professionalCameras: HardwareCamera[] = [
  {
    id: "macroLens",
    minDistance: 0.1,
    maxDistance: 0.5,
    minLightLevel: 50,
    maxLightLevel: 5000,
  },
  {
    id: "wideAngle",
    minDistance: 0.3,
    maxDistance: 10,
    minLightLevel: 10,
    maxLightLevel: 8000,
  },
  {
    id: "standardLens",
    minDistance: 0.5,
    maxDistance: 30,
    minLightLevel: 5,
    maxLightLevel: 9000,
  },
  {
    id: "telephotoLens",
    minDistance: 10,
    maxDistance: 100,
    minLightLevel: 20,
    maxLightLevel: 10000,
  },
  {
    id: "nightVision",
    minDistance: 1,
    maxDistance: 50,
    minLightLevel: 1,
    maxLightLevel: 100,
  },
];

console.log(
  "Professional setup:",
  canCoverRequirements(professionalRequirements, professionalCameras)
);
// Tests if this professional camera setup meets the demanding requirements

// Example 5: Testing an edge case with no cameras
console.log("No cameras:", canCoverRequirements(basicRequirements, []));
// Output: false - Can't cover anything with no cameras
