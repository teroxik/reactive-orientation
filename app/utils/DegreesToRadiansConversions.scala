package utils

import scalaz.Lens
import actors.StreamMergingActor.{OrientationChangeData, OrientationChangeEvent}

trait DegreesToRadiansConversions {

  def convertDegreesToRadians(event: OrientationChangeEvent) = {
    val dataLens = Lens.lensu[OrientationChangeEvent, OrientationChangeData] (
      (a, value) => a.copy(data = value), _.data
    )

    dataLens mod ((data: OrientationChangeData) =>
      OrientationChangeData(math.toRadians(data.alpha), math.toRadians(data.beta), math.toRadians(data.gamma)), event)
  }
}