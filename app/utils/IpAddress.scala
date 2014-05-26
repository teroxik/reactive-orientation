package utils

import java.net.{InetAddress, NetworkInterface}
import collection.JavaConverters._
import scalaz._
import Scalaz._

object IpAddress {

  def getIpAddresses() = {
    def processAddress(address: InetAddress): String =
      address.getAddress.take(4).map(_ & 0xFF).mkString(".")

    def findIpAddresses() = {
      Validation.fromTryCatch(
        NetworkInterface
          .getNetworkInterfaces().asScala
          .flatMap(_.getInetAddresses.asScala)
          .map(processAddress)
          .toList
      )
    }

    findIpAddresses() match {
      case Success(addresses) => addresses.mkString(", ")
      case Failure(_) => "Ip address could not be retrieved. Please find your ip address manually to continue"
    }
  }


}
